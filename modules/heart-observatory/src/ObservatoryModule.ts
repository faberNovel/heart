import {
  Helper,
  Module,
  ModuleAnalysisInterface,
  ModuleInterface,
  Report,
  ObservatoryResult,
  ObservatoryConfig,
} from "@fabernovel/heart-core"
import { Client } from "./api/Client"

export class ObservatoryModule
  extends Module
  implements ModuleAnalysisInterface<ObservatoryConfig, ObservatoryResult>
{
  private readonly TIME_BETWEEN_TRIES = 10000

  private apiClient: Client
  private threshold?: number

  constructor(module: Omit<ModuleInterface, "id">) {
    super(module)

    this.apiClient = new Client()
  }

  public async startAnalysis(
    conf: ObservatoryConfig,
    threshold?: number
  ): Promise<Report<ObservatoryResult>> {
    this.threshold = threshold

    await this.apiClient.launchAnalysis(conf)

    return this.requestScan()
  }

  private async requestScan(): Promise<Report<ObservatoryResult>> {
    const scan = await this.apiClient.getAnalysisReport()

    return this.handleRequestScan(scan)
  }

  private async handleRequestScan(scan: ObservatoryResult): Promise<Report<ObservatoryResult>> {
    switch (scan.state) {
      case "FAILED":
        throw new Error(scan.state)

      case "PENDING":
      case "STARTING":
      case "RUNNING":
        await Helper.timeout(this.TIME_BETWEEN_TRIES)
        return this.requestScan()

      case "FINISHED":
        return new Report({
          analyzedUrl: this.apiClient.getProjectHost(),
          note: scan.grade,
          rawResults: scan,
          resultUrl: this.apiClient.getAnalyzeUrl(),
          service: this.service,
          date: new Date(scan.end_time),
          normalizedNote: scan.score > 100 ? 100 : scan.score,
          threshold: this.threshold,
        })

      default:
        throw new Error(scan.state)
    }
  }
}
