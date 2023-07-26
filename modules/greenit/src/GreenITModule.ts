import type { Config, GreenITConfig, ModuleMetadata } from "@fabernovel/heart-common"
import { GreenITReport, Module, logger, type ModuleAnalysisInterface } from "@fabernovel/heart-common"
import { requestResult } from "./api/Client.js"

export class GreenITModule extends Module implements ModuleAnalysisInterface<GreenITConfig, GreenITReport> {
  #threshold?: number

  constructor(moduleMetadata: ModuleMetadata, verbose: boolean) {
    super(moduleMetadata, verbose)

    if (verbose) {
      logger.info(`${moduleMetadata.name} initialized.`)
    }
  }

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
