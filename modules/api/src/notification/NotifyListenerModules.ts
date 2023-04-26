import type {
  ModuleListenerInterface,
  ValidatedAnalysisInput,
  GenericReport,
  Result,
} from "@fabernovel/heart-common"
import type { FastifyRequest, FastifyReply } from "fastify"

function notifyListenerModules(
  listenerModules: ModuleListenerInterface[],
  report: GenericReport<Result>
): Promise<unknown[]> {
  const notifyListenerModulesPromises = listenerModules.map((listenerModule) => {
    return listenerModule.notifyAnalysisDone(report)
  })

  return Promise.all(notifyListenerModulesPromises)
}

export function createNotifyListenerModulesHandler(
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
