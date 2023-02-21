import { CorsOptions } from "cors"
import { Server } from "http"
import { Config, ModuleListenerInterface, Result } from "../index.js"
import { ModuleAnalysisInterface } from "./ModuleAnalysisInterface.js"
import { ModuleInterface } from "./ModuleInterface.js"

/**
 * Define a Server module.
 */
export interface ModuleServerInterface extends ModuleInterface {
  startServer: (
    analysisModules: ModuleAnalysisInterface<Config, Result>[],
    listenerModules: ModuleListenerInterface[],
    port: number,
    cors?: CorsOptions
  ) => Server
}

/**
 * Constructor interface signature
 * @see {@link https://www.typescriptlang.org/docs/handbook/interfaces.html#difference-between-the-static-and-instance-sides-of-classes}
 */
export type ModuleServer = new () => ModuleServerInterface

/**
 * Checks if a module is a Server one.
 * @see {@link https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards | User-Defined Type Guards}
 */
export function isModuleServer(module: ModuleInterface): module is ModuleServerInterface {
  const m = module as ModuleServerInterface

  return m !== undefined && m.startServer !== undefined && "function" === typeof m.startServer
}
