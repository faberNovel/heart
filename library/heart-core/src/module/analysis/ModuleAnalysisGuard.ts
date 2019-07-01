import ModuleAnalysisInterface from '../../module/analysis/ModuleAnalysisInterface';

/**
 * Checks if a module is an Analysis one.
 * @see {@link https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards | User-Defined Type Guards}
 */
export default function isModuleAnalysis(module: ModuleAnalysisInterface | any): module is ModuleAnalysisInterface {
  const m = module as ModuleAnalysisInterface;

  return m.Analysis !== undefined && 'function' === typeof m.Analysis;
}
