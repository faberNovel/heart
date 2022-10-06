import { Module, ModuleAnalysisInterface, ModuleInterface, Report } from "@fabernovel/heart-core"

import { runAnalysis } from "./api/Client"
import { Result } from "./api/model/Result"
import { GreenITConfig } from "./config/Config"

export class GreenITModule extends Module implements ModuleAnalysisInterface<GreenITConfig> {
  private threshold?: number

  constructor(module: Omit<ModuleInterface, "id">) {
    super(module)
  }

  public async startAnalysis(conf: GreenITConfig, threshold?: number): Promise<Report> {
    this.threshold = threshold

    const result = await runAnalysis(conf)

    if (!result.success) {
      throw new Error("Error during GreenIT analysis")
    } else {
      return this.handleResults(result)
    }
  }

  private handleResults(results: Result): Report {
    return new Report({
      analyzedUrl: results.url,
      date: new Date(results.date),
      note: results.ecoIndex.toString(),
      service: this.service,
      threshold: this.threshold,
    })
  }
}
