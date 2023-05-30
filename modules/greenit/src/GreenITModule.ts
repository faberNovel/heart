import type { Config, GreenITConfig } from "@fabernovel/heart-common"
import { Module, type ModuleAnalysisInterface, GreenITReport } from "@fabernovel/heart-common"
import { requestResult } from "./api/Client.js"

export class GreenITModule extends Module implements ModuleAnalysisInterface<GreenITConfig, GreenITReport> {
  #threshold?: number

  public async startAnalysis(config: GreenITConfig, threshold?: number): Promise<GreenITReport> {
    this.#threshold = threshold

    const result = await requestResult(config)

    return this.#handleResult(config, result)
  }

  #handleResult(config: Config, result: GreenITReport["result"]): GreenITReport {
    const [date, time] = result.date.split(" ")
    const [day, month, year] = date.split("/")

    return new GreenITReport({
      analyzedUrl: result.url,
      date: new Date(`${year}-${month}-${day}T${time}`),
      result: result,
      service: this.service,
      inputs: {
        config: config,
        threshold: this.#threshold,
      },
    })
  }
}
