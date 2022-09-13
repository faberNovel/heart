import { Config } from "../../config/Config"
import { Report } from "../report/Report"
import { ThresholdInputObject } from "../threshold/ReportThresholdObject"
import { ModuleInterface } from "./ModuleInterface"

/**
 * Define an Analysis module.
 */
export interface ModuleAnalysisInterface<T extends Config> extends ModuleInterface {
  startAnalysis: (conf: T, thresholds?: ThresholdInputObject) => Promise<Report>
}

/**
 * Constructor interface signature
 * @see {@link https://www.typescriptlang.org/docs/handbook/interfaces.html#difference-between-the-static-and-instance-sides-of-classes}
 */
export type ModuleAnalysis<T extends Config> = new () => ModuleAnalysisInterface<T>

/**
 * Checks if a module is an Analysis one.
 * @see {@link https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards | User-Defined Type Guards}
 */
export function isModuleAnalysis<T extends Config>(
  module: ModuleInterface
): module is ModuleAnalysisInterface<T> {
  const m = module as ModuleAnalysisInterface<T>

  return m !== undefined && m.startAnalysis !== undefined && "function" === typeof m.startAnalysis
}
