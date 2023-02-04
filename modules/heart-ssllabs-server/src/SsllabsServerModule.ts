import {
  Helper,
  Module,
  ModuleAnalysisInterface,
  ModuleInterface,
  Report,
  SsllabsServerResult,
  SsllabsServerStatus,
  SsllabsServerConfig,
  SsllabsServerEndpoint,
} from "@fabernovel/heart-core"
import { Client } from "./api/Client"
import { transform } from "./transformer/GradeTransformer"

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

    return this.requestResult()
  }

  /**
   * Retrieve the average endpoint percentage
   */
  private computeNote(endpoints: SsllabsServerEndpoint[]): number {
    const grades = endpoints.map((endpoint: SsllabsServerEndpoint) => transform(endpoint.grade))

    if (0 === grades.length) {
      return 0
    }

    const sumGrades = grades.reduce(
      (previousValue: number, currentValue: number) => previousValue + currentValue
    )

    return sumGrades / grades.length
  }

  private async handleResult(
    result: SsllabsServerResult,
    triesQty: number
  ): Promise<Report<SsllabsServerResult>> {
    switch (result.status) {
      case SsllabsServerStatus.ERROR:
        throw new Error(`${result.status}: ${result.statusMessage}`)

      case SsllabsServerStatus.DNS:
      case SsllabsServerStatus.IN_PROGRESS:
        await Helper.timeout(SsllabsServerModule.TIME_BETWEEN_TRIES)
        return this.requestResult(++triesQty)

      case SsllabsServerStatus.READY: {
        const note = this.computeNote(result.endpoints)

        return new Report({
          analyzedUrl: this.apiClient.getProjectUrl(),
          date: new Date(result.startTime),
          result: result,
          note: note.toString(),
          normalizedNote: note,
          resultUrl: this.apiClient.getAnalyzeUrl(),
          service: this.service,
          threshold: this.threshold,
        })
      }

      default:
        throw new Error(result.statusMessage)
    }
  }

  private async requestResult(triesQty = 1): Promise<Report<SsllabsServerResult>> {
    if (triesQty > SsllabsServerModule.MAX_TRIES) {
      throw new Error(
        `The maximum number of tries (${SsllabsServerModule.MAX_TRIES}) to retrieve the report has been reached.`
      )
    }

    const result = await this.apiClient.getResult()

    return this.handleResult(result, triesQty)
  }
}
