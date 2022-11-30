import { Module, ModuleAnalysisInterface, ModuleInterface, Report } from "@fabernovel/heart-core"

import { runAnalysis } from "./api/Client"
import { Result } from "./api/model/Result"
import { GreenITConfig } from "./config/Config"

export class GreenITModule extends Module implements ModuleAnalysisInterface<GreenITConfig, Result> {
  private threshold?: number

  constructor(module: Omit<ModuleInterface, "id">) {
    super(module)
  }

  public async startAnalysis(conf: GreenITConfig, threshold?: number): Promise<Report<Result>> {
    this.threshold = threshold

    const result = await runAnalysis(conf)

    return this.handleResults(result)
  }

  private handleResults(results: Result): Report<Result> {
    return new Report({
      analyzedUrl: results.url,
      date: new Date(),
      rawResults: results,
      note: results.ecoIndex.toString(),
      service: this.service,
      threshold: this.threshold,
    })
  }
}
