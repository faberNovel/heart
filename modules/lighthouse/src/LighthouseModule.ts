import {
  Config,
  LighthouseConfig,
  LighthouseReport,
  Module,
  ModuleAnalysisInterface,
} from "@fabernovel/heart-common"
import { requestResult } from "./api/Client.js"

export class LighthouseModule
  extends Module
  implements ModuleAnalysisInterface<LighthouseConfig, LighthouseReport>
{
  private threshold?: number

  public async startAnalysis(config: LighthouseConfig, threshold?: number): Promise<LighthouseReport> {
    this.threshold = threshold

    const result = await requestResult(config)

    return this.handleResult(config, result)
  }

  private handleResult(config: Config, result: LighthouseReport["result"]): LighthouseReport {
    return new LighthouseReport({
      analyzedUrl: result.requestedUrl as string,
      date: new Date(result.fetchTime),
      result: result,
      service: this.service,
      inputs: {
        config: config,
        threshold: this.threshold,
      },
    })
  }
}
