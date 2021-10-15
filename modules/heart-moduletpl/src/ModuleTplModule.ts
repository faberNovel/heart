import { Module, ModuleAnalysisInterface, ModuleInterface, Report } from '@fabernovel/heart-core';

export default class ModuleTplModule extends Module implements ModuleAnalysisInterface {
  constructor(module: Partial<ModuleInterface>) {
    super(module);
  }

  startAnalysis: (conf: object) => Promise<Report>;
}
