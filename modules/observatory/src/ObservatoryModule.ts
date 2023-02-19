import {
  Helper,
  Module,
  ModuleAnalysisInterface,
  ModuleInterface,
  Report,
  ObservatoryResult,
  ObservatoryConfig,
} from "@fabernovel/heart-common"
import { Client } from "./api/Client.js"

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

    return this.requestResult()
  }

  private async requestResult(): Promise<Report<ObservatoryResult>> {
    const result = await this.apiClient.getResult()

    return this.handleResult(result)
  }

  private async handleResult(result: ObservatoryResult): Promise<Report<ObservatoryResult>> {
    switch (result.state) {
      case "FAILED":
        throw new Error(result.state)

      case "PENDING":
      case "STARTING":
      case "RUNNING":
        await Helper.timeout(this.TIME_BETWEEN_TRIES)
        return this.requestResult()

      case "FINISHED":
        return new Report({
          analyzedUrl: this.apiClient.getProjectHost(),
          note: result.grade,
          result: result,
          resultUrl: this.apiClient.getAnalyzeUrl(),
          service: this.service,
          date: new Date(result.end_time),
          normalizedNote: Math.min(result.score, 100),
          threshold: this.threshold,
        })

      default:
        throw new Error(result.state)
    }
  }
}
