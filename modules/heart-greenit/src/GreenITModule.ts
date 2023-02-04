import type { GreenITConfig, GreenITResult } from "@fabernovel/heart-core"
import { Module, ModuleAnalysisInterface, ModuleInterface, Report } from "@fabernovel/heart-core"
import { requestResult } from "./api/Client"

export class GreenITModule extends Module implements ModuleAnalysisInterface<GreenITConfig, GreenITResult> {
  private threshold?: number

  constructor(module: Omit<ModuleInterface, "id">) {
    super(module)
  }

  public async startAnalysis(conf: GreenITConfig, threshold?: number): Promise<Report<GreenITResult>> {
    this.threshold = threshold

    const result = await requestResult(conf)

    return this.handleResult(result)
  }

  private handleResult(result: GreenITResult): Report<GreenITResult> {
    return new Report({
      analyzedUrl: result.url,
      date: new Date(),
      result: result,
      note: result.ecoIndex.toString(),
      service: this.service,
      threshold: this.threshold,
    })
  }
}
