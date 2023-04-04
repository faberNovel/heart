import {
  Config,
  GenericReport,
  InputError,
  Module,
  ModuleAnalysisInterface,
  ModuleListenerInterface,
  ModuleServerInterface,
  ParsedInput,
  Result,
  ValidatedInput,
  validateAnalysisInput,
} from "@fabernovel/heart-common"
import cors, { FastifyCorsOptions } from "@fastify/cors"
import Fastify, { FastifyError, FastifyInstance, FastifyReply, FastifyRequest } from "fastify"

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
  ): (req: FastifyRequest<{ Body: ValidatedInput }>, reply: FastifyReply) => Promise<FastifyReply> {
    return async (request, reply) => {
      const config = request.body
      const threshold = request.body.threshold === undefined ? undefined : Number(request.body.threshold)
      const exceptListeners = request.body.except_listeners
      const onlyListeners = request.body.only_listeners

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

  #createRoutePreHandler(listenerModules: ModuleListenerInterface[]) {
    return () => async (request: FastifyRequest<{ Body: ParsedInput }>) => {
      const config = request.body.config
      const threshold = request.body.threshold === undefined ? undefined : Number(request.body.threshold)
      const exceptListeners = request.body.except_listeners
      const onlyListeners = request.body.only_listeners

      const listenerModulesIds = listenerModules.map((listenerModule) => listenerModule.id)

      validateAnalysisInput(config, threshold, listenerModulesIds, exceptListeners, onlyListeners)
    }
  }

  #registerRoutes(
    analysisModules: ModuleAnalysisInterface<Config, GenericReport<Result>>[],
    listenerModules: ModuleListenerInterface[]
  ): void {
    analysisModules.forEach((analysisModule) => {
      const path = `/${analysisModule.id}`

      const routeHandler = this.#createRouteHandler(analysisModule, listenerModules)
      const routePreHandler = this.#createRoutePreHandler(listenerModules)

      this.#fastify.post(path, {
        handler: routeHandler,
        preHandler: routePreHandler,
      })
    })
  }
}
