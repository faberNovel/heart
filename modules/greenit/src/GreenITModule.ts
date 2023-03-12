import type { GreenITConfig } from "@fabernovel/heart-common"
import { Module, ModuleAnalysisInterface, GreenITReport } from "@fabernovel/heart-common"
import { requestResult } from "./api/Client.js"

export class GreenITModule extends Module implements ModuleAnalysisInterface<GreenITConfig, GreenITReport> {
  private threshold?: number

  public async startAnalysis(conf: GreenITConfig, threshold?: number): Promise<GreenITReport> {
    this.threshold = threshold

    const result = await requestResult(conf)

    return this.handleResult(result)
  }

  private handleResult(result: GreenITReport["result"]): GreenITReport {
    const [date, time] = result.date.split(" ")
    const [day, month, year] = date.split("/")

    return new GreenITReport({
      analyzedUrl: result.url,
      date: new Date(`${year}-${month}-${day}T${time}`),
      result: result,
      service: this.service,
      threshold: this.threshold,
    })
  }
}
