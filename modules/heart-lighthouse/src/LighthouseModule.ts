import { Module, ModuleAnalysisInterface, ModuleInterface } from '@fabernovel/heart-core'

import LighthouseReport from './api/model/LighthouseReport'
import { runAnalysis } from './api/Client'
import { Config } from './config/Config'
import { Categories } from './scoring/compute'

interface Lhr {
  categories: Categories
  requestedUrl: string
  fetchTime: string
}

export default class LighthouseModule extends Module implements ModuleAnalysisInterface {
  constructor(module: Partial<ModuleInterface>) {
    super(module)
  }

  public async startAnalysis(conf: Config): Promise<LighthouseReport> {
    try {
      const results = await runAnalysis(conf)

      return this.handleResults(results.lhr)
    } catch (error) {
      throw new Error(error)
    }
  }

  private handleResults(lhr: Lhr): LighthouseReport {
    return new LighthouseReport({
      analyzedUrl: lhr.requestedUrl,
      date: new Date(lhr.fetchTime),
      service: this.service,
      value: lhr.categories,
    })
  }
}
