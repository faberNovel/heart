import {
  Helper,
  Module,
  ModuleAnalysisInterface,
  GenericReport,
  ObservatoryResult,
  ObservatoryConfig,
} from "@fabernovel/heart-common"
import { Client } from "./api/Client.js"
import { Scan } from "./api/model/Scan.js"

const TIME_BETWEEN_TRIES = 10000

export class ObservatoryModule
  extends Module
  implements ModuleAnalysisInterface<ObservatoryConfig, ObservatoryResult>
{
  #client = new Client()

  public async startAnalysis(
    conf: ObservatoryConfig,
    threshold?: number
  ): Promise<ObservatoryReport> {
    const scan = await this.#client.triggerAnalysis(conf)

    const finishedScan = await this.requestFinishedScan(scan)

    const result = await this.#client.requestTests(finishedScan)

    return new ObservatoryReport({
      analyzedUrl: conf.host,
      result: result,
      resultUrl: this.#client.getAnalyzeUrl(),
      service: this.service,
      date: new Date(finishedScan.end_time),
      threshold: threshold,
    })
  }

  /**
   * Request the Scan until its state goes to "FINISHED"
   */
  private async requestFinishedScan(scan: Scan): Promise<Scan> {
    switch (scan.state) {
      case "PENDING":
      case "STARTING":
      case "RUNNING": {
        // wait a bit before a new request (the scanning operation takes several seconds)
        await Helper.timeout(TIME_BETWEEN_TRIES)
        const newScan = await this.#client.requestScan()

        return this.requestFinishedScan(newScan)
      }

      case "FINISHED":
        return scan

      case "FAILED":
      default:
        throw new Error(scan.state)
    }
  }
}
