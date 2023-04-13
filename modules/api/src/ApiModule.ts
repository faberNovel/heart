import {
  Config,
  GenericReport,
  InputError,
  Module,
  ModuleAnalysisInterface,
  ModuleListenerInterface,
  ModuleServerInterface,
  ParsedAnalysisInput,
  Result,
  ValidatedAnalysisInput,
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

// using declaration merging, add your plugin props to the appropriate fastify interfaces
// if prop type is defined here, the value will be typechecked when you call decorate{,Request,Reply}
declare module "fastify" {
  interface FastifyRequest {
    report: GenericReport<Result>
  }
}

function createNotifyListenerModulesHandler(
  listenerModules: ModuleListenerInterface[]
): (request: FastifyRequest<{ Body: ValidatedAnalysisInput }>, reply: FastifyReply) => Promise<void> {
  return async (request, reply) => {
    if (reply.statusCode >= 200 && reply.statusCode < 300) {
      const { except_listeners, only_listeners } = request.body

      const listenerModulesResolved = new Array<ModuleListenerInterface>()

      if (except_listeners !== undefined) {
        listenerModulesResolved.push(
          ...listenerModules.filter((listenerModule) => !except_listeners.includes(listenerModule.id))
        )
      } else if (only_listeners !== undefined) {
        listenerModulesResolved.push(
          ...listenerModules.filter((listenerModules) => only_listeners.includes(listenerModules.id))
        )
      } else {
        listenerModulesResolved.push(...listenerModules)
      }

      await notifyListenerModules(listenerModulesResolved, request.report)
    }
  }
}

function createRouteHandler(
  analysisModule: ModuleAnalysisInterface<Config, GenericReport<Result>>
): (request: FastifyRequest<{ Body: ValidatedAnalysisInput }>, reply: FastifyReply) => Promise<FastifyReply> {
  return async (request, reply) => {
    const { config, threshold } = request.body

    const report = await analysisModule.startAnalysis(config, threshold)

    request.report = report

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

function createRoutePreHandler(
  listenerModules: ModuleListenerInterface[]
): (
  request: FastifyRequest<{ Body: ParsedAnalysisInput }>,
  reply: FastifyReply,
  done: HookHandlerDoneFunction
) => void {
  return (request, _reply, done) => {
    const listenerModulesIds = listenerModules.map((listenerModule) => listenerModule.id)

    validateAnalysisInput(request.body, listenerModulesIds)

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
    return reply.status(400).send({
      errors: error.cause.map((c) => c.message),
    })
  } else {
    return reply.status(500).send({
      errors: [error.message],
    })
  }
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
    this.#fastify.setErrorHandler(handleErrors)

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
