import {
  Helper,
  Module,
  type ModuleAnalysisInterface,
  SsllabsServerReport,
  SsllabsServerStatus,
  type SsllabsServerConfig,
  type Config,
} from "@fabernovel/heart-common"
import { Client } from "./api/Client.js"

export class SsllabsServerModule
  extends Module
  implements ModuleAnalysisInterface<SsllabsServerConfig, SsllabsServerReport>
{
  private static readonly MAX_TRIES = 100
  private static readonly TIME_BETWEEN_TRIES = 10000 // 10 seconds
  private apiClient = new Client()
  private threshold?: number

  public async startAnalysis(config: SsllabsServerConfig, threshold?: number): Promise<SsllabsServerReport> {
    this.threshold = threshold

    await this.apiClient.launchAnalysis(config)

    return this.requestResult(config)
  }

  private async handleResult(
    config: Config,
    result: SsllabsServerReport["result"],
    triesQty: number
  ): Promise<SsllabsServerReport> {
    switch (result.status) {
      case SsllabsServerStatus.ERROR:
        throw new Error(`${result.status}: ${result.statusMessage}`)

      case SsllabsServerStatus.DNS:
      case SsllabsServerStatus.IN_PROGRESS:
        await Helper.timeout(SsllabsServerModule.TIME_BETWEEN_TRIES)
        return this.requestResult(config, ++triesQty)

      case SsllabsServerStatus.READY:
        return new SsllabsServerReport({
          analyzedUrl: this.apiClient.getProjectUrl(),
          date: new Date(result.startTime),
          result: result,
          resultUrl: this.apiClient.getAnalyzeUrl(),
          service: this.service,
          inputs: {
            config: config,
            threshold: this.threshold,
          },
        })

      default:
        throw new Error(result.statusMessage)
    }
  }

  private async requestResult(config: Config, triesQty = 1): Promise<SsllabsServerReport> {
    if (triesQty > SsllabsServerModule.MAX_TRIES) {
      throw new Error(
        `The maximum number of tries (${SsllabsServerModule.MAX_TRIES}) to retrieve the report has been reached.`
      )
    }

    const result = await this.apiClient.getResult()

    return this.handleResult(config, result, triesQty)
  }
}
