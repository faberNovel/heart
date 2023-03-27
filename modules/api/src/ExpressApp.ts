import {
  Config,
  GenericReport,
  InputError,
  ModuleAnalysisInterface,
  ModuleListenerInterface,
  Result,
  validateInput,
} from "@fabernovel/heart-common"
import cors, { CorsOptions } from "cors"
import express from "express"
import { createJsonError } from "./error/JsonError.js"

type ReqBody = Config & {
  except_listeners?: string[]
  only_listeners?: string[]
}

type ReqQuery = {
  threshold?: string
}

/**
 * Creates and configures an ExpressJS application.
 */
export class ExpressApp {
  // reference to the Express instance
  private _express: express.Application
  private listenerModules: ModuleListenerInterface[]

  constructor(
    analysisModules: ModuleAnalysisInterface<Config, GenericReport<Result>>[],
    listenerModules: ModuleListenerInterface[],
    corsOptions?: CorsOptions
  ) {
    this._express = express()
    this.configure()
    this.addCommonMiddlewares(corsOptions)
    this.listenerModules = listenerModules
    this.init(analysisModules)
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

  private createRouteHandler<C extends Config, R extends GenericReport<Result>>(
    module: ModuleAnalysisInterface<C, R>
  ): express.RequestHandler<unknown, unknown, ReqBody, ReqQuery> {
    return (
      request: express.Request<unknown, unknown, ReqBody, ReqQuery>,
      response: express.Response,
      next: express.NextFunction
    ) => {
      try {
        const [config, threshold] = validateInput<C>(
          undefined,
          JSON.stringify(request.body),
          request.query.threshold,
          this.listenerModules,
          request.body.except_listeners,
          request.body.only_listeners
        )

        module
          .startAnalysis(config, threshold)
          .then((report: GenericReport<Result>) => {
            const notifyListenerModulesPromises = this.listenerModules.map((listenerModule) =>
              listenerModule.notifyAnalysisDone(report)
            )

            Promise.all(notifyListenerModulesPromises)
              .then(() => {
                response.status(200).json({
                  analyzedUrl: report.analyzedUrl,
                  date: report.date,
                  grade: report.grade,
                  isThresholdReached: report.isThresholdReached() ?? null,
                  normalizedGrade: report.normalizedGrade,
                  result: report.result,
                  resultUrl: report.resultUrl ?? null,
                  service: {
                    name: report.service.name,
                    logo: report.service.logo ?? null,
                  },
                  threshold: report.threshold ?? null,
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
  private init(analysisModules: ModuleAnalysisInterface<Config, GenericReport<Result>>[]): void {
    const router = express.Router()

    analysisModules.forEach((analysisModule) => {
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
  _next: express.NextFunction
) {
  console.error(error)

  if (error instanceof InputError) {
    response.status(400).json(createJsonError(error.message))
  } else if (error instanceof Error) {
    response.status(500).json(createJsonError(error.message))
  } else {
    response.status(500).json(createJsonError("A server error occured"))
  }
}
