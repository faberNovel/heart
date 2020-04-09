import { Module, ModuleAnalysisInterface, ModuleInterface, Report } from '@fabernovel/heart-core'

import { runAnalysis } from './api/Client'
import { Config } from './config/Config'
import compute from './scoring/compute'


export default class LighthouseModule extends Module implements ModuleAnalysisInterface {
  constructor(module: Partial<ModuleInterface>) {
    super(module)
  }

  public async startAnalysis(conf: Config): Promise<Report> {
    try {
      const results = await runAnalysis(conf)

      return this.handleResults(results.lhr)
    } catch (error) {
      throw new Error(error)
    }
  }

  private handleResults(lhr: any): Report {
    const score = compute(lhr.categories, 1)

    return new Report({
      analyzedUrl: lhr.requestedUrl,
      date: new Date(lhr.fetchTime),
      service: this.service,
      note: score.toString()
    })
  }
}
