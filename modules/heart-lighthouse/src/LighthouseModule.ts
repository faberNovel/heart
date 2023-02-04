import {
  LighthouseConfig,
  LighthouseResult,
  Module,
  ModuleAnalysisInterface,
  ModuleInterface,
  Report,
} from "@fabernovel/heart-core"
import { requestResult } from "./api/Client"
import { compute } from "./scoring/compute"

export class LighthouseModule
  extends Module
  implements ModuleAnalysisInterface<LighthouseConfig, LighthouseResult>
{
  private threshold?: number

  constructor(module: Omit<ModuleInterface, "id">) {
    super(module)
  }

  public async startAnalysis(conf: LighthouseConfig, threshold?: number): Promise<Report<LighthouseResult>> {
    this.threshold = threshold

    const result = await requestResult(conf)

    return this.handleResult(result)
  }

  private handleResult(result: LighthouseResult): Report<LighthouseResult> {
    const score = compute(result.categories, 1)

    return new Report({
      analyzedUrl: result.requestedUrl,
      date: new Date(result.fetchTime),
      result: result,
      service: this.service,
      note: score.toString(),
      normalizedNote: score,
      threshold: this.threshold,
    })
  }
}
