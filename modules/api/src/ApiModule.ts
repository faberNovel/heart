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
import Fastify, {
  FastifyError,
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  HookHandlerDoneFunction,
} from "fastify"

function createRoutePreHandler(
  listenerModules: ModuleListenerInterface[]
): (
  request: FastifyRequest<{ Body: ParsedInput }>,
  reply: FastifyReply,
  done: HookHandlerDoneFunction
) => void {
  return (request, _reply, done) => {
    const listenerModulesIds = listenerModules.map((listenerModule) => listenerModule.id)

    validateAnalysisInput(
      listenerModulesIds,
      request.body.config,
      request.body.threshold,
      request.body.except_listeners,
      request.body.only_listeners
    )

    done()
  }
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
): Promise<unknown[]> {
  const notifyListenerModulesPromises = listenerModules.map((listenerModule) => {
    return listenerModule.notifyAnalysisDone(report)
  })

  return Promise.all(notifyListenerModulesPromises)
}

export class ApiModule extends Module implements ModuleServerInterface {
  #fastify = Fastify()
  #report: GenericReport<Result> | undefined

  async createServer(
    analysisModules: ModuleAnalysisInterface<Config, GenericReport<Result>>[],
    listenerModules: ModuleListenerInterface[],
    corsOptions?: FastifyCorsOptions
  ): Promise<FastifyInstance> {
    // plugins registration
    await this.#fastify.register(cors, corsOptions)

    // hooks registration
    this.#fastify.addHook("onResponse", this.#createOnResponseHookHandler(listenerModules))

    // route registration
    this.#registerRoutes(analysisModules, listenerModules)

    // error handler registration
    this.#fastify.setErrorHandler(handleErrors)

    return this.#fastify
  }

  #createOnResponseHookHandler(
    listenerModules: ModuleListenerInterface[]
  ): (request: FastifyRequest<{ Body: ValidatedInput }>) => Promise<void> {
    return async (request) => {
      // this.#report is set in the route handler
      if (this.#report !== undefined) {
        const { except_listeners, only_listeners } = request.body

        const listenerModulesResolved = new Array<ModuleListenerInterface>()

        if (except_listeners !== undefined) {
          listenerModulesResolved.concat(
            listenerModules.filter((listenerModule) => !except_listeners.includes(listenerModule.id))
          )
        } else if (only_listeners !== undefined) {
          listenerModulesResolved.concat(
            listenerModules.filter((listenerModules) => only_listeners.includes(listenerModules.id))
          )
        } else {
          listenerModulesResolved.concat(listenerModules)
        }

        await notifyListenerModules(listenerModulesResolved, this.#report)
      }
    }
  }

  #createRouteHandler(
    analysisModule: ModuleAnalysisInterface<Config, GenericReport<Result>>
  ): (request: FastifyRequest<{ Body: ValidatedInput }>, reply: FastifyReply) => Promise<FastifyReply> {
    return async (request, reply) => {
      const { config, threshold } = request.body

      const report = await analysisModule.startAnalysis(config, threshold)

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
    }
  }

  #registerRoutes(
    analysisModules: ModuleAnalysisInterface<Config, GenericReport<Result>>[],
    listenerModules: ModuleListenerInterface[]
  ): void {
    analysisModules.forEach((analysisModule) => {
      const path = `/${analysisModule.id}`

      const routeHandler = this.#createRouteHandler(analysisModule)
      const routePreHandler = createRoutePreHandler(listenerModules)

      this.#fastify.post(path, {
        handler: routeHandler,
        preHandler: routePreHandler,
      })
    })
  }
}
