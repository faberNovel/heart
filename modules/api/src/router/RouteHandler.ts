import {
  Config,
  GenericReport,
  ModuleAnalysisInterface,
  ModuleListenerInterface,
  ParsedAnalysisInput,
  Result,
  ValidatedAnalysisInput,
  validateAnalysisInput,
} from "@fabernovel/heart-common"
import type { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from "fastify"

export function createRouteHandler(
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

export function createRoutePreHandler(
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
