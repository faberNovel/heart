import {
  type Config,
  type GenericReport,
  Module,
  type ModuleAnalysisInterface,
  type ModuleListenerInterface,
  type ModuleServerInterface,
  type Result,
} from "@fabernovel/heart-common"
import cors, { type FastifyCorsOptions } from "@fastify/cors"
import Fastify, { type FastifyInstance } from "fastify"
import { errorHandler } from "./error/ErrorHandler.js"
import { createNotifyListenerModulesHandler } from "./notification/NotifyListenerModules.js"
import { createRouteHandler, createRoutePreHandler } from "./router/RouteHandler.js"

// using declaration merging, add your plugin props to the appropriate fastify interfaces
// if prop type is defined here, the value will be typechecked when you call decorate{,Request,Reply}
declare module "fastify" {
  interface FastifyRequest {
    report: GenericReport<Result>
  }
}

export class ApiModule extends Module implements ModuleServerInterface {
  #fastify = Fastify()

  async createServer(
    analysisModules: ModuleAnalysisInterface<Config, GenericReport<Result>>[],
    listenerModules: ModuleListenerInterface[],
    corsOptions?: FastifyCorsOptions
  ): Promise<FastifyInstance> {
    // plugins registration
    await this.#fastify.register(cors, corsOptions)

    // decorator registration
    // objects must be initialized with "null"
    this.#fastify.decorateRequest("report", null)

    // hooks registration
    this.#fastify.addHook("onResponse", createNotifyListenerModulesHandler(listenerModules))

    // route registration
    this.#registerRoutes(analysisModules, listenerModules)

    // error handler registration
    this.#fastify.setErrorHandler(errorHandler)

    return this.#fastify
  }

  #registerRoutes(
    analysisModules: ModuleAnalysisInterface<Config, GenericReport<Result>>[],
    listenerModules: ModuleListenerInterface[]
  ): void {
    const routePreHandler = createRoutePreHandler(listenerModules)

    analysisModules.forEach((analysisModule) => {
      const path = `/${analysisModule.id}`

      const routeHandler = createRouteHandler(analysisModule)

      this.#fastify.post(path, {
        handler: routeHandler,
        preHandler: routePreHandler,
      })
    })
  }
}
