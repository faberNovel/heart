import {
  Config,
  GenericReport,
  InputError,
  Module,
  ModuleAnalysisInterface,
  ModuleListenerInterface,
  ModuleServerInterface,
  Result,
  validateAnalysisInput,
} from "@fabernovel/heart-common"
import cors, { FastifyCorsOptions } from "@fastify/cors"
import Fastify, { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import { createJsonError } from "./error/JsonError.js"
import configSchema from "./validation/input/config.json" assert { type: "json" }
import listenerSchema from "./validation/input/listener.json" assert { type: "json" }
import thresholdSchema from "./validation/input/threshold.json" assert { type: "json" }

type ReqBody = Config & {
  except_listeners?: string[]
  only_listeners?: string[]
}

interface ReqQuery {
  threshold?: string
}

export class ApiModule extends Module implements ModuleServerInterface {
  #fastify = Fastify()
  #listenerModules = new Array<ModuleListenerInterface>()
  #listenerModulesFiltered = new Array<ModuleListenerInterface>()
  #report: GenericReport<Result> | undefined

  async createServer(
    analysisModules: ModuleAnalysisInterface<Config, GenericReport<Result>>[],
    listenerModules: ModuleListenerInterface[],
    corsOptions?: FastifyCorsOptions
  ): Promise<FastifyInstance> {
    this.#listenerModules = listenerModules

    // plugins registration
    this.#fastify.addSchema(configSchema)
    this.#fastify.addSchema(listenerSchema)
    this.#fastify.addSchema(thresholdSchema)
    await this.#fastify.register(cors, corsOptions)

    // hooks
    this.#fastify.addHook("onResponse", () => {
      this.#notifyListenerModules()
    })

    this.#createRoutes(analysisModules)

    return this.#fastify
  }

  #createRouteHandler(
    analysisModule: ModuleAnalysisInterface<Config, GenericReport<Result>>
  ): (
    req: FastifyRequest<{ Body: ReqBody; Querystring: ReqQuery }>,
    reply: FastifyReply
  ) => Promise<FastifyReply> {
    return async (request, reply) => {
      const config = request.body
      const threshold = request.query.threshold === undefined ? undefined : Number(request.query.threshold)
      const exceptListeners = request.body.except_listeners
      const onlyListeners = request.body.only_listeners

      try {
        validateAnalysisInput(
          undefined,
          config,
          threshold,
          this.#listenerModules.map((listenerModule) => listenerModule.id),
          exceptListeners,
          onlyListeners
        )

        const report = await analysisModule.startAnalysis(config, threshold)

        // update internal state objects for a later step with listener modules
        this.#report = report
        if (exceptListeners !== undefined) {
          this.#listenerModulesFiltered = this.#listenerModules.filter(
            (listenerModule) => !exceptListeners.includes(listenerModule.id)
          )
        } else if (onlyListeners !== undefined) {
          this.#listenerModulesFiltered = this.#listenerModules.filter((listenerModules) =>
            onlyListeners.includes(listenerModules.id)
          )
        } else {
          this.#listenerModulesFiltered = this.#listenerModules
        }

        return reply.send({
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
      } catch (error) {
        if (error instanceof InputError) {
          this.#fastify.log.error(error)
          return reply.code(400).send(createJsonError(error.message))
        } else {
          this.#fastify.log.fatal(error)
          return reply.code(500).send(createJsonError("A server error occured"))
        }
      }
    }
  }

  #createRoutes(analysisModules: ModuleAnalysisInterface<Config, GenericReport<Result>>[]): void {
    analysisModules.forEach((analysisModule) => {
      const path = `/${analysisModule.id}`

      const routeHandler = this.#createRouteHandler(analysisModule)

      this.#fastify.post(path, {
        schema: {
          body: {
            allOf: [{ $ref: "config#" }, { $ref: "listener#" }],
          },
          querystring: {
            $ref: "threshold#",
          },
        },
        handler: routeHandler,
      })
    })
  }

  #notifyListenerModules(): void {
    if (this.#report !== undefined) {
      const notifyListenerModulesPromises = this.#listenerModulesFiltered.map((listenerModule) => {
        return listenerModule.notifyAnalysisDone(this.#report!)
      })

      void Promise.all(notifyListenerModulesPromises)
    }
  }
}
