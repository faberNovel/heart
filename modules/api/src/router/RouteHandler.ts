import {
  type Config,
  type GenericReport,
  type ModuleAnalysisInterface,
  type Result,
  type ValidatedAnalysisInput,
} from "@fabernovel/heart-common"
import type { FastifyReply, FastifyRequest } from "fastify"

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
      inputs: {
        config: report.inputs.config,
        threshold: report.inputs.threshold ?? null,
      },
      isThresholdReached: report.isThresholdReached() ?? null,
      normalizedGrade: report.normalizedGrade,
      result: report.result,
      resultUrl: report.resultUrl ?? null,
      service: {
        name: report.service.name,
        logo: report.service.logo ?? null,
      },
    })
  }
}
