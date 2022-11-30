import {
  Config,
  ConfigError,
  isModuleAnalysis,
  isModuleListener,
  ModuleAnalysisInterface,
  ModuleInterface,
  ModuleListenerInterface,
  RawResult,
  Report,
  ThresholdError,
  validateInput,
} from "@fabernovel/heart-core"
import * as cors from "cors"
import { CorsOptions } from "cors"
import * as express from "express"
import { createJsonError } from "./error/JsonError"

/**
 * Creates and configures an ExpressJS application.
 */
export class ExpressApp {
  // reference to the Express instance
  private _express: express.Application
  private listenerModules: ModuleListenerInterface[]

  constructor(modules: ModuleInterface[], corsOptions?: CorsOptions) {
    this._express = express()
    this.configure()
    this.addCommonMiddlewares(corsOptions)
    this.listenerModules = modules.filter((module: ModuleInterface): module is ModuleListenerInterface =>
      isModuleListener(module)
    )
    this.init(modules)
    this.addErrorHandlerMiddleware() // The error handler middleware must be added last, after other middlewares and routes declaration
  }

  get express(): express.Application {
    return this._express
  }

  /**
   * @see {@link https://expressjs.com/fr/api.html#app.settings.table}
   */
  private configure() {
    this.express.set("case sensitive routing", false)
    this.express.set("env", "production")
    this.express.set("strict routing", false)
  }

  private createRouteHandler<C extends Config, R extends RawResult>(
    module: ModuleAnalysisInterface<C, R>
  ): express.RequestHandler {
    return (
      request: express.Request<unknown, unknown, C>,
      response: express.Response,
      next: express.NextFunction
    ) => {
      try {
        const [config, threshold] = validateInput<C>(
          undefined,
          JSON.stringify(request.body),
          typeof request.query.threshold === "string" ? request.query.threshold : undefined
        )

        module
          .startAnalysis(config, threshold)
          .then((report: Report<R>) => {
            const notifyListenerModulesPromises = this.listenerModules.map((listenerModule) =>
              listenerModule.notifyAnalysisDone(report)
            )

            Promise.all(notifyListenerModulesPromises)
              .then(() => {
                response.status(200).json({
                  analyzedUrl: report.analyzedUrl,
                  date: report.date,
                  rawResults: report.rawResults,
                  service: {
                    name: report.service.name,
                  },
                  note: report.note,
                  normalizedNote: report.normalizedNote,
                  resultUrl: report.resultUrl,
                  threshold: report.threshold ?? null,
                  isThresholdReached: report.isThresholdReached() ?? null,
                })
              })
              .catch(next)
          })
          .catch(next)
      } catch (error) {
        next(error)
      }
    }
  }

  /**
   * Register routes for the Analysis modules
   */
  private init(modules: ModuleInterface[]): void {
    const router = express.Router()

    modules
      .filter((module: ModuleInterface): module is ModuleAnalysisInterface<Config, RawResult> =>
        isModuleAnalysis(module)
      )
      .forEach((analysisModule) => {
        const path = `/${analysisModule.id}`

        router.post(path, this.createRouteHandler(analysisModule))
      })

    this.express.use("/", router)
  }

  /**
   * Configure Express middleware for the given path
   */
  private addCommonMiddlewares(corsOptions?: CorsOptions): void {
    const middlewares: express.RequestHandler[] = [express.json(), express.urlencoded({ extended: false })]

    if (undefined !== corsOptions) {
      middlewares.push(cors(corsOptions))
    }

    this.express.use(middlewares)
  }

  private addErrorHandlerMiddleware(): void {
    this.express.use(errorHandler)
  }
}

function errorHandler(
  error: unknown,
  _request: express.Request,
  response: express.Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: express.NextFunction
) {
  console.error(error)

  if (error instanceof ConfigError || error instanceof ThresholdError) {
    response.status(400).json(createJsonError(error.message))
  } else if (error instanceof Error) {
    response.status(500).json(createJsonError(error.message))
  } else {
    response.status(500).json(createJsonError("A server error occured"))
  }
}
