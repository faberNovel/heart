import {
  AnalysisEvents,
  Config,
  ConfigError,
  isModuleAnalysis,
  isModuleListener,
  ModuleAnalysisInterface,
  ModuleInterface,
  Report,
  ThresholdError,
  validateInput,
} from "@fabernovel/heart-core"
import { CorsOptions } from "cors"
import * as EventEmitter from "events"
import * as express from "express"
import * as cors from "cors"
import { createJsonError } from "./error/JsonError"

/**
 * Creates and configures an ExpressJS application.
 */
export class ExpressApp {
  // reference to the Express instance
  private _express: express.Application
  private eventEmitter: EventEmitter

  constructor(modules: ModuleInterface[], corsOptions?: CorsOptions) {
    this._express = express()
    this.configure()
    this.addCommonMiddlewares(corsOptions)
    this.eventEmitter = new EventEmitter()
    this.init(modules)
    this.addErrorHandlerMiddleware() // The error handler middleware must be added last, after other middlewares and route declaration
  }

  get express(): express.Application {
    return this._express
  }

  /**
   * @see {@link https://expressjs.com/fr/api.html#app.settings.table|Express settings}
   */
  private configure() {
    this.express.set("case sensitive routing", true)
    this.express.set("env", "production")
    this.express.set("strict routing", false)
    this.express.set("x-powered-by", false)
  }

  private createRouteHandler<T extends Config>(module: ModuleAnalysisInterface<T>): express.RequestHandler {
    return (
      request: express.Request<unknown, unknown, T>,
      response: express.Response,
      next: express.NextFunction
    ) => {
      try {
        const [config, threshold] = validateInput<T>(
          undefined,
          JSON.stringify(request.body),
          typeof request.query.threshold === "string" ? request.query.threshold : undefined
        )

        module
          .startAnalysis(config, threshold)
          .then((report: Report) => {
            this.eventEmitter.emit(AnalysisEvents.DONE, report)

            response.status(200).json({
              analyzedUrl: report.analyzedUrl,
              date: report.date,
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
      } catch (error) {
        next(error)
      }
    }
  }

  /**
   * Register:
   * - events listeners for Listener modules
   * - routes for Analysis modules
   */
  private init(modules: ModuleInterface[]): void {
    const router = express.Router()

    modules.forEach((module: ModuleInterface) => {
      // register events
      if (isModuleListener(module)) {
        module.registerEvents(this.eventEmitter)
        // register routes
      } else if (isModuleAnalysis(module)) {
        const path = `/${module.id}`

        router.post(path, this.createRouteHandler(module))
      }
    })

    this.express.use("/", router)
  }

  /**
   * Configure Express middleware for the given path
   */
  private addCommonMiddlewares(corsOptions?: CorsOptions): void {
    const middlewares = [express.json(), express.urlencoded({ extended: false })]

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
