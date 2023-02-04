import {
  Helper,
  Module,
  ModuleAnalysisInterface,
  ModuleInterface,
  Report,
  SsllabsServerResult,
  SsllabsServerStatus,
  SsllabsServerConfig,
} from "@fabernovel/heart-core"
import { getAveragePercentage } from "./api/calculation/GetAveragePercentage"
import { Client } from "./api/Client"

export class SsllabsServerModule
  extends Module
  implements ModuleAnalysisInterface<SsllabsServerConfig, SsllabsServerResult>
{
  private static readonly MAX_TRIES = 100
  private static readonly TIME_BETWEEN_TRIES = 10000 // 10 seconds
  private apiClient: Client
  private threshold?: number

  constructor(module: Omit<ModuleInterface, "id">) {
    super(module)

    this.apiClient = new Client()
  }

  public async startAnalysis(
    conf: SsllabsServerConfig,
    threshold?: number
  ): Promise<Report<SsllabsServerResult>> {
    this.threshold = threshold
    await this.apiClient.launchAnalysis(conf)

    return this.requestReport()
  }

  private async requestReport(triesQty = 1): Promise<Report<SsllabsServerResult>> {
    if (triesQty > SsllabsServerModule.MAX_TRIES) {
      throw new Error(
        `The maximum number of tries (${SsllabsServerModule.MAX_TRIES}) to retrieve the report has been reached.`
      )
    }

    const host = await this.apiClient.getAnalysisReport()

    return this.handleRequestScan(host, triesQty)
  }

  private async handleRequestScan(
    host: SsllabsServerResult,
    triesQty: number
  ): Promise<Report<SsllabsServerResult>> {
    switch (host.status) {
      case SsllabsServerStatus.ERROR:
        throw new Error(`${host.status}: ${host.statusMessage}`)

      case SsllabsServerStatus.DNS:
      case SsllabsServerStatus.IN_PROGRESS:
        await Helper.timeout(SsllabsServerModule.TIME_BETWEEN_TRIES)
        return this.requestReport(++triesQty)

      case SsllabsServerStatus.READY: {
        const note = getAveragePercentage(host.endpoints)

        return new Report({
          analyzedUrl: this.apiClient.getProjectUrl(),
          date: new Date(host.startTime),
          Results: host,
          note: note.toString(),
          normalizedNote: note,
          resultUrl: this.apiClient.getAnalyzeUrl(),
          service: this.service,
          threshold: this.threshold,
        })
      }

      default:
        throw new Error(host.statusMessage)
    }
  }
}
