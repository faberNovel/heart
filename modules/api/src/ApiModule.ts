import type {
  Config,
  GenericReport,
  ModuleAnalysisInterface,
  ModuleListenerInterface,
  Result,
} from "@fabernovel/heart-common"
import { Module, ModuleServerInterface } from "@fabernovel/heart-common"
import type { CorsOptions } from "cors"
import * as http from "http"
import { ExpressApp } from "./ExpressApp.js"

export class ApiModule extends Module implements ModuleServerInterface {
  startServer(
    analysisModules: ModuleAnalysisInterface<Config, GenericReport<Result>>[],
    listenerModules: ModuleListenerInterface[],
    port: number,
    corsOptions?: CorsOptions
  ): http.Server {
    const app = new ExpressApp(analysisModules, listenerModules, corsOptions)

    return http.createServer(app.express).listen(port)
  }
}
