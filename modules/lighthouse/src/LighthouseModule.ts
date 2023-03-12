import {
  LighthouseConfig,
  LighthouseResult,
  Module,
  ModuleAnalysisInterface,
  ModuleInterface,
  LighthouseReport,
} from "@fabernovel/heart-common"
import { requestResult } from "./api/Client.js"

export class LighthouseModule
  extends Module
  implements ModuleAnalysisInterface<LighthouseConfig, LighthouseResult>
{
  private threshold?: number

  constructor(module: Pick<ModuleInterface, "name" | "service">) {
    super(module)
  }

  public async startAnalysis(conf: LighthouseConfig, threshold?: number): Promise<LighthouseReport> {
    this.threshold = threshold

    const result = await requestResult(conf)

    return this.handleResult(result)
  }

  private handleResult(result: LighthouseResult): LighthouseReport {
    return new LighthouseReport({
      analyzedUrl: result.requestedUrl as string,
      date: new Date(result.fetchTime),
      result: result,
      resultUrl: undefined,
      service: this.service,
      threshold: this.threshold,
    })
  }
}
