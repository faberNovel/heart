import {
  Config,
  GenericReport,
  Module,
  ModuleAnalysisInterface,
  ModuleListenerInterface,
  ModuleServerInterface,
  Result,
} from "@fabernovel/heart-common"
import type { CorsOptions } from "cors"
import { createServer, Server } from "http"
import { ExpressApp } from "./ExpressApp.js"

export class ApiModule extends Module implements ModuleServerInterface {
  startServer(
    analysisModules: ModuleAnalysisInterface<Config, GenericReport<Result>>[],
    listenerModules: ModuleListenerInterface[],
    port: number,
    corsOptions?: CorsOptions
  ): Server {
    const app = new ExpressApp(analysisModules, listenerModules, corsOptions)

    return createServer(app.express).listen(port)
  }
}
