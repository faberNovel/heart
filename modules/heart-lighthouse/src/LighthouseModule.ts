import { Module, ModuleAnalysisInterface, ModuleInterface, Report, ThresholdInputObject, } from '@fabernovel/heart-core'
import { Result } from 'lighthouse'
import { runAnalysis } from './api/Client'
import { LighthouseConfig } from './config/Config'
import {compute} from './scoring/compute'

export class LighthouseModule extends Module implements ModuleAnalysisInterface<LighthouseConfig> {
  private thresholds?: ThresholdInputObject

  constructor(module: Omit<ModuleInterface, 'id'>) {
    super(module)
  }

  public async startAnalysis(conf: LighthouseConfig, thresholds?: ThresholdInputObject): Promise<Report> {
    this.thresholds = thresholds;

    const results = await runAnalysis(conf)

    return this.handleResults(results)
  }

  private handleResults(result: Result): Report {
    const score = compute(result.categories, 1)

    return new Report({
      analyzedUrl: result.requestedUrl,
      date: new Date(result.fetchTime),
      service: this.service,
      note: score.toString(),
      normalizedNote: score,
      thresholds: this.thresholds
    })
  }
}
