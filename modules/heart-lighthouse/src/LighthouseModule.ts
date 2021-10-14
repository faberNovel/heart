import { Module, ModuleAnalysisInterface, ModuleInterface, ReportInterface } from '@fabernovel/heart-core'

import { runAnalysis } from './api/Client'
import LighthouseReport from './api/model/LighthouseReport'
import { Config } from './config/Config'
import compute from './scoring/compute'


export default class LighthouseModule extends Module implements ModuleAnalysisInterface {
  constructor(module: Partial<ModuleInterface>) {
    super(module)
  }

  public async startAnalysis(conf: Config): Promise<ReportInterface> {
    try {
      const results = await runAnalysis(conf)

      return this.handleResults(results.lhr)
    } catch (error) {
      throw new Error(error)
    }
  }

  private handleResults(lhr: any): ReportInterface {
    const score = compute(lhr.categories, 1)

    return new LighthouseReport({
      analyzedUrl: lhr.requestedUrl,
      date: new Date(lhr.fetchTime),
      service: this.service,
      note: score.toString()
    })
  }
}
