import { Module, ModuleInterface, ModuleServerInterface } from "@fabernovel/heart-core"
import { CorsOptions } from "cors"
import * as http from "http"
import { ExpressApp } from "./ExpressApp.js"

export class ApiModule extends Module implements ModuleServerInterface {
  constructor(module: Omit<ModuleInterface, "id">) {
    super(module)
  }

  startServer(modules: ModuleInterface[], port: number, corsOptions?: CorsOptions): http.Server {
    const app = new ExpressApp(modules, corsOptions)

    return http.createServer(app.express).listen(port)
  }
}
