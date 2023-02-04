import type { GreenITConfig, GreenITResult } from "@fabernovel/heart-core"
import { Module, ModuleAnalysisInterface, ModuleInterface, Report } from "@fabernovel/heart-core"
import { runAnalysis } from "./api/Client"

export class GreenITModule extends Module implements ModuleAnalysisInterface<GreenITConfig, GreenITResult> {
  private threshold?: number

  constructor(module: Omit<ModuleInterface, "id">) {
    super(module)
  }

  public async startAnalysis(conf: GreenITConfig, threshold?: number): Promise<Report<GreenITResult>> {
    this.threshold = threshold

    const result = await runAnalysis(conf)

    return this.handleResults(result)
  }

  private handleResults(results: GreenITResult): Report<GreenITResult> {
    return new Report({
      analyzedUrl: results.url,
      date: new Date(),
      Results: results,
      note: results.ecoIndex.toString(),
      service: this.service,
      threshold: this.threshold,
    })
  }
}
