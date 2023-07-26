import {
  LighthouseReport,
  Module,
  logger,
  type Config,
  type LighthouseConfig,
  type ModuleAnalysisInterface,
  type ModuleMetadata,
} from "@fabernovel/heart-common"
import { requestResult } from "./api/Client.js"

export class LighthouseModule
  extends Module
  implements ModuleAnalysisInterface<LighthouseConfig, LighthouseReport>
{
  #threshold?: number

  constructor(moduleMetadata: ModuleMetadata, verbose: boolean) {
    super(moduleMetadata, verbose)

    if (verbose) {
      logger.info(`${moduleMetadata.name} initialized.`)
    }
  }

  public async startAnalysis(config: LighthouseConfig, threshold?: number): Promise<LighthouseReport> {
    this.#threshold = threshold

    const result = await requestResult(config, this.verbose)

    return this.#handleResult(config, result)
  }

  #handleResult(config: Config, result: LighthouseReport["result"]): LighthouseReport {
    return new LighthouseReport({
      analyzedUrl: result.requestedUrl ?? "",
      date: new Date(result.fetchTime),
      result: result,
      service: this.service,
      inputs: {
        config: config,
        threshold: this.#threshold,
      },
    })
  }
}
