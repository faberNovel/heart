import type {
  Config,
  GenericReport,
  ModuleAnalysisInterface,
  ModuleListenerInterface,
  Result,
} from "@fabernovel/heart-common"
import type { FastifyInstance } from "fastify"
import { ApiModule } from "../../src/ApiModule.js"

export async function createServer(
  analysisModules: ModuleAnalysisInterface<Config, GenericReport<Result>>[],
  listenerModules: ModuleListenerInterface[]
): Promise<FastifyInstance> {
  const apiModule = new ApiModule(
    {
      id: "api",
      type: "server",
      name: "Heart API",
      service: {
        name: "Heart API",
      },
    },
    false
  )

  return apiModule.createServer(analysisModules, listenerModules)
}
