import { GenericReport } from "../report/Report.js"
import { Result } from "../report/Result.js"
import { ModuleInterface } from "./ModuleInterface.js"

/**
 * Define an Listener module.
 */
export interface ModuleListenerInterface extends ModuleInterface {
  notifyAnalysisDone(report: GenericReport<Result>): Promise<unknown>
}

/**
 * Constructor interface signature
 * @see {@link https://www.typescriptlang.org/docs/handbook/interfaces.html#difference-between-the-static-and-instance-sides-of-classes}
 */
export type ModuleListener = new () => ModuleListenerInterface

/**
 * Checks if a module is a Listener one.
 * @see {@link https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards | User-Defined Type Guards}
 */
export function isModuleListener(module: ModuleInterface): module is ModuleListenerInterface {
  const m = module as ModuleListenerInterface

  return m !== undefined && m.notifyAnalysisDone !== undefined && "function" === typeof m.notifyAnalysisDone
}
