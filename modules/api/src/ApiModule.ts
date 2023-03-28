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
import Fastify, { FastifyError, FastifyInstance, FastifyReply, FastifyRequest, FastifySchema } from "fastify"
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

/**
 * @see {@link https://www.fastify.io/docs/latest/Reference/Server/#seterrorhandler}
 */
async function handleErrors(
  error: FastifyError,
  _request: FastifyRequest,
  reply: FastifyReply
): Promise<FastifyReply> {
  if (error instanceof InputError) {
    return reply.status(400).send(error)
  }

  // fastify will use parent error handler to handle this
  return reply.send(error)
}

function notifyListenerModules(
  listenerModules: ModuleListenerInterface[],
  report: GenericReport<Result>
): void {
  const notifyListenerModulesPromises = listenerModules.map((listenerModule) => {
    return listenerModule.notifyAnalysisDone(report)
  })

  void Promise.all(notifyListenerModulesPromises)
}

export class ApiModule extends Module implements ModuleServerInterface {
  #fastify = Fastify()
  #listenerModulesFiltered = new Array<ModuleListenerInterface>()
  #report: GenericReport<Result> | undefined

  async createServer(
    analysisModules: ModuleAnalysisInterface<Config, GenericReport<Result>>[],
    listenerModules: ModuleListenerInterface[],
    corsOptions?: FastifyCorsOptions
  ): Promise<FastifyInstance> {
    // schemas registration
    this.#fastify.addSchema(configSchema)
    this.#fastify.addSchema(listenerSchema)
    this.#fastify.addSchema(thresholdSchema)

    // plugins registration
    await this.#fastify.register(cors, corsOptions)

    // hooks registration
    this.#fastify.addHook("onResponse", () => {
      if (this.#report !== undefined) {
        // should not happens, as the report is set during the route handler
        notifyListenerModules(this.#listenerModulesFiltered, this.#report)
      }
    })

    // route registration
    this.#registerRoutes(analysisModules, listenerModules)

    // error handler registration
    this.#fastify.setErrorHandler(handleErrors)

    return this.#fastify
  }

  #createRouteHandler(
    analysisModule: ModuleAnalysisInterface<Config, GenericReport<Result>>,
    listenerModules: ModuleListenerInterface[]
  ): (
    req: FastifyRequest<{ Body: ReqBody; Querystring: ReqQuery }>,
    reply: FastifyReply
  ) => Promise<FastifyReply> {
    const listenerModulesIds = listenerModules.map((listenerModule) => listenerModule.id)

    return async (request, reply) => {
      const config = request.body
      const threshold = request.query.threshold === undefined ? undefined : Number(request.query.threshold)
      const exceptListeners = request.body.except_listeners
      const onlyListeners = request.body.only_listeners

      validateAnalysisInput(undefined, config, threshold, listenerModulesIds, exceptListeners, onlyListeners)

      const report = await analysisModule.startAnalysis(config, threshold)

      // update internal state objects for a later usage (trigger listerner modules)
      this.#report = report
      if (exceptListeners !== undefined) {
        this.#listenerModulesFiltered = listenerModules.filter(
          (listenerModule) => !exceptListeners.includes(listenerModule.id)
        )
      } else if (onlyListeners !== undefined) {
        this.#listenerModulesFiltered = listenerModules.filter((listenerModules) =>
          onlyListeners.includes(listenerModules.id)
        )
      } else {
        this.#listenerModulesFiltered = listenerModules
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
    }
  }

  #registerRoutes(
    analysisModules: ModuleAnalysisInterface<Config, GenericReport<Result>>[],
    listenerModules: ModuleListenerInterface[]
  ): void {
    const schema: FastifySchema = {
      body: {
        allOf: [{ $ref: "config#" }, { $ref: "listener#" }],
      },
      querystring: {
        $ref: "threshold#",
      },
    }

    analysisModules.forEach((analysisModule) => {
      const path = `/${analysisModule.id}`

      const routeHandler = this.#createRouteHandler(analysisModule, listenerModules)

      this.#fastify.post(path, {
        schema: schema,
        handler: routeHandler,
      })
    })
  }
}
