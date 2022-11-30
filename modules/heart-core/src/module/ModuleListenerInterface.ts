import { Report } from "../report/Report"
import { RawResult } from "./output/RawResult"
import { ModuleInterface } from "./ModuleInterface"

/**
 * Define an Listener module.
 */
export interface ModuleListenerInterface extends ModuleInterface {
  notifyAnalysisDone<R extends RawResult>(report: Report<R>): Promise<void>
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
