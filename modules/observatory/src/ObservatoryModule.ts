import {
  Helper,
  Module,
  ObservatoryReport,
  ObservatoryScanState,
  logger,
  type ModuleAnalysisInterface,
  type ModuleMetadata,
  type ObservatoryConfig,
} from "@fabernovel/heart-common"
import { Client } from "./api/Client.js"
import { ObservatoryError } from "./error/ObservatoryError.js"

const TIME_BETWEEN_TRIES = 10000

export class ObservatoryModule
  extends Module
  implements ModuleAnalysisInterface<ObservatoryConfig, ObservatoryReport>
{
  #client = new Client()

  constructor(moduleMetadata: ModuleMetadata, verbose: boolean) {
    super(moduleMetadata, verbose)

    if (verbose) {
      logger.info(`${moduleMetadata.name} initialized.`)
    }
  }

  public async startAnalysis(config: ObservatoryConfig, threshold?: number): Promise<ObservatoryReport> {
    const scan = await this.#client.triggerAnalysis(config)

    const finishedScan = await this.#requestFinishedScan(scan)

    const tests = await this.#client.requestTests(finishedScan)

    return new ObservatoryReport({
      analyzedUrl: config.host,
      date: new Date(finishedScan.end_time),
      result: {
        scan: finishedScan,
        tests: tests,
      },
      resultUrl: this.#client.getAnalyzeUrl(),
      service: this.service,
      inputs: {
        config: config,
        threshold: threshold,
      },
    })
  }

  /**
   * Request the Scan until its state goes to "FINISHED"
   */
  async #requestFinishedScan(
    scan: ObservatoryReport["result"]["scan"]
  ): Promise<ObservatoryReport["result"]["scan"]> {
    switch (scan.state) {
      case ObservatoryScanState.PENDING:
      case ObservatoryScanState.STARTING:
      case ObservatoryScanState.RUNNING: {
        // wait a bit before a new request (the scanning operation takes several seconds)
        await Helper.timeout(TIME_BETWEEN_TRIES)
        const newScan = await this.#client.requestScan()

        return this.#requestFinishedScan(newScan)
      }

      case ObservatoryScanState.FINISHED:
        return scan

      case ObservatoryScanState.FAILED:
      default: {
        const e = new ObservatoryError(scan.state)
        return Promise.reject(e)
      }
    }
  }
}
