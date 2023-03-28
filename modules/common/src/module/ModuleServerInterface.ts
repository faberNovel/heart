import type { FastifyCorsOptions } from "@fastify/cors"
import type { FastifyInstance } from "fastify"
import type { Config, GenericReport, ModuleListenerInterface, Result } from "../index.js"
import type { ModuleAnalysisInterface } from "./ModuleAnalysisInterface.js"
import type { ModuleInterface } from "./ModuleInterface.js"

/**
 * Define a Server module.
 */
export interface ModuleServerInterface extends ModuleInterface {
  createServer: (
    analysisModules: ModuleAnalysisInterface<Config, GenericReport<Result>>[],
    listenerModules: ModuleListenerInterface[],
    cors?: FastifyCorsOptions
  ) => Promise<FastifyInstance>
}

/**
 * Constructor interface signature
 * @see {@link https://www.typescriptlang.org/docs/handbook/interfaces.html#difference-between-the-static-and-instance-sides-of-classes}
 */
export type ModuleServer = new () => ModuleServerInterface

/**
 * Checks if a module is a Server one.
 * @see {@link https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates | User-Defined Type Guards}
 */
export function isModuleServer(module: ModuleInterface): module is ModuleServerInterface {
  return (module as ModuleServerInterface).createServer !== undefined
}
