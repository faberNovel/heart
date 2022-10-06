import { Helper, Module, ModuleAnalysisInterface, ModuleInterface, Report } from "@fabernovel/heart-core"
import { Status } from "./api/enum/Status"
import { Host } from "./api/model/Host"
import { Client } from "./api/Client"
import { SsllabsServerConfig } from "./config/Config"

export class SsllabsServerModule extends Module implements ModuleAnalysisInterface<SsllabsServerConfig> {
  private static readonly MAX_TRIES = 100
  private static readonly TIME_BETWEEN_TRIES = 10000 // 10 seconds
  private apiClient: Client
  private threshold?: number

  constructor(module: Omit<ModuleInterface, "id">) {
    super(module)

    this.apiClient = new Client()
  }

  public async startAnalysis(conf: SsllabsServerConfig, threshold?: number): Promise<Report> {
    this.threshold = threshold
    await this.apiClient.launchAnalysis(conf)

    return this.requestReport()
  }

  private async requestReport(triesQty = 1): Promise<Report> {
    if (triesQty > SsllabsServerModule.MAX_TRIES) {
      throw new Error(
        `The maximum number of tries (${SsllabsServerModule.MAX_TRIES}) to retrieve the report has been reached.`
      )
    }

    const host = await this.apiClient.getAnalysisReport()

    return this.handleRequestScan(host, triesQty)
  }

  private async handleRequestScan(host: Host, triesQty: number): Promise<Report> {
    switch (host.status) {
      case Status.ERROR:
        throw new Error(`${host.status}: ${host.statusMessage}`)

      case Status.DNS:
      case Status.IN_PROGRESS:
        await Helper.timeout(SsllabsServerModule.TIME_BETWEEN_TRIES)
        return this.requestReport(++triesQty)

      case Status.READY:
        return new Report({
          analyzedUrl: this.apiClient.getProjectUrl(),
          note: host.getAveragePercentage().toString(),
          normalizedNote: host.getAveragePercentage(),
          resultUrl: this.apiClient.getAnalyzeUrl(),
          date: new Date(host.startTime),
          service: this.service,
          threshold: this.threshold,
        })

      default:
        throw new Error(host.statusMessage)
    }
  }
}
