import {
  Config,
  GenericReport,
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
      try {
        const [validatedConfig, validatedThreshold, listenerModulesFiltered] = validateAnalysisInput(
          undefined,
          JSON.stringify(request.body),
          request.query.threshold,
          this.#listenerModules,
          request.body.except_listeners,
          request.body.only_listeners
        )

        const report = await analysisModule.startAnalysis(validatedConfig, validatedThreshold)

        this.#listenerModulesFiltered = listenerModulesFiltered
        this.#report = report

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
        if (error instanceof Error) {
          return reply.code(400).send(createJsonError(error.message))
        } else {
          return reply.code(500).send(createJsonError("A server error occured"))
        }
      }
    }
  }

  #createRoutes(analysisModules: ModuleAnalysisInterface<Config, GenericReport<Result>>[]): void {
    analysisModules.forEach((analysisModule) => {
      const path = `/${analysisModule.id}`

      const routeHandler = this.#createRouteHandler(analysisModule)

      this.#fastify.post(path, routeHandler)
    })
  }

  #notifyListenerModules(): void {
    if (this.#report !== undefined) {
      const notifyListenerModulesPromises = this.#listenerModulesFiltered.map((listenerModule) => {
        return listenerModule.notifyAnalysisDone(this.#report as GenericReport<Result>)
      })

      void Promise.all(notifyListenerModulesPromises)
    }
  }
}
