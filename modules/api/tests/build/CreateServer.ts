import type { FastifyInstance } from "fastify"
import { ApiModule } from "../../src/ApiModule.js"
import { analysisModules } from "../data/AnalsysisModules.js"
import { listenerModules } from "../data/ListenerModules.js"

export async function createServer(): Promise<FastifyInstance> {
  const apiModule = new ApiModule({
    name: "Heart API",
    service: {
      name: "Heart API",
    },
  })

  return apiModule.createServer(analysisModules, listenerModules)
}
