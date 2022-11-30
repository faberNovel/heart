import { Report } from "../report/Report"
import { Config } from "./input/Config"
import { ModuleInterface } from "./ModuleInterface"
import { RawResult } from "./output/RawResult"

/**
 * Define an Analysis module.
 */
export interface ModuleAnalysisInterface<C extends Config, R extends RawResult> extends ModuleInterface {
  startAnalysis: (conf: C, thresholds?: number) => Promise<Report<R>>
}

/**
 * Constructor interface signature
 * @see {@link https://www.typescriptlang.org/docs/handbook/interfaces.html#difference-between-the-static-and-instance-sides-of-classes}
 */
export type ModuleAnalysis<C extends Config, R extends RawResult> = new () => ModuleAnalysisInterface<C, R>

/**
 * Checks if a module is an Analysis one.
 * @see {@link https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards | User-Defined Type Guards}
 */
export function isModuleAnalysis<C extends Config, R extends RawResult>(
  module: ModuleInterface
): module is ModuleAnalysisInterface<C, R> {
  const m = module as ModuleAnalysisInterface<C, R>

  return m !== undefined && m.startAnalysis !== undefined && "function" === typeof m.startAnalysis
}
