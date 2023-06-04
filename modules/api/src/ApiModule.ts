import {
  type Config,
  type GenericReport,
  Module,
  type ModuleAnalysisInterface,
  type ModuleListenerInterface,
  type ModuleServerInterface,
  type Result,
  getAnalysisValidationSchema,
} from "@fabernovel/heart-common"
import cors, { type FastifyCorsOptions } from "@fastify/cors"
import Fastify, { type FastifyInstance } from "fastify"
import { createNotifyListenerModulesHandler } from "./notification/NotifyListenerModules.js"
import { createRouteHandler } from "./router/RouteHandler.js"
import _AjvErrors from "ajv-errors"
// temp workaround for ESM: https://github.com/ajv-validator/ajv/issues/2132#issuecomment-1537224620
const AjvErrors = _AjvErrors.default

// using declaration merging, add your plugin props to the appropriate fastify interfaces
// if prop type is defined here, the value will be typechecked when you call decorate{,Request,Reply}
declare module "fastify" {
  interface FastifyRequest {
    report: GenericReport<Result>
  }
}

export class ApiModule extends Module implements ModuleServerInterface {
  #fastify = Fastify({
    ajv: {
      customOptions: {
        allErrors: true,
      },
      plugins: [AjvErrors],
    },
  })

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

    return this.#fastify
  }

  #registerRoutes(
    analysisModules: ModuleAnalysisInterface<Config, GenericReport<Result>>[],
    listenerModules: ModuleListenerInterface[]
  ): void {
    const bodySchema = getAnalysisValidationSchema(listenerModules.map((m) => m.id))

    analysisModules.forEach((analysisModule) => {
      const path = `/${analysisModule.id}`

      const routeHandler = createRouteHandler(analysisModule)

      this.#fastify.post(path, {
        handler: routeHandler,
        schema: {
          body: bodySchema,
        },
      })
    })
  }
}
