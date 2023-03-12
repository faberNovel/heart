import {
  LighthouseConfig,
  LighthouseReport,
  Module,
  ModuleAnalysisInterface,
  ModuleInterface,
} from "@fabernovel/heart-common"
import { requestResult } from "./api/Client.js"

export class LighthouseModule
  extends Module
  implements ModuleAnalysisInterface<LighthouseConfig, LighthouseReport>
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

  private handleResult(result: LighthouseReport["result"]): LighthouseReport {
    return new LighthouseReport({
      analyzedUrl: result.requestedUrl as string,
      date: new Date(result.fetchTime),
      result: result,
      service: this.service,
      threshold: this.threshold,
    })
  }
}
