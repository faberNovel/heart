import {
  Config,
  Helper,
  Module,
  ModuleAnalysisInterface,
  ModuleInterface,
  Report,
} from "@fabernovel/heart-core"
import { Client } from "./api/Client"
import { DareboostResult } from "./api/model/Result"

export class DareboostModule extends Module implements ModuleAnalysisInterface<Config, DareboostResult> {
  private readonly MAX_TRIES = 500
  private readonly TIME_BETWEEN_TRIES = 5000

  private conf: Config = { url: "" }
  private apiClient: Client
  private threshold?: number

  constructor(module: Omit<ModuleInterface, "id">) {
    super(module)

    this.apiClient = new Client()
  }

  public async startAnalysis(conf: Config, threshold?: number): Promise<Report<DareboostResult>> {
    this.conf = conf
    this.threshold = threshold

    const analyse = await this.apiClient.launchAnalysis(this.conf)

    return this.requestReport(analyse.reportId)
  }

  private async requestReport(reportId: string, triesQty = 1): Promise<Report<DareboostResult>> {
    if (triesQty > this.MAX_TRIES) {
      throw new Error(
        `The maximum number of tries (${this.MAX_TRIES}) to retrieve the report has been reached.`
      )
    }

    const result = await this.apiClient.getAnalysisReport(reportId)

    return this.handleResponseStatus(result, reportId, triesQty)
  }

  private async handleResponseStatus(
    result: DareboostResult,
    reportId: string,
    triesQty: number
  ): Promise<Report<DareboostResult>> {
    switch (result.status) {
      case 202:
        await Helper.timeout(this.TIME_BETWEEN_TRIES)
        return this.requestReport(reportId, ++triesQty)

      case 200:
        return new Report({
          analyzedUrl: this.conf.url,
          date: new Date(result.report.date),
          rawResults: result,
          service: this.service,
          resultUrl: result.report.publicReportUrl,
          note: result.report.summary.score.toString(),
          normalizedNote: result.report.summary.score,
          threshold: this.threshold,
        })

      default:
        throw new Error(result.message)
    }
  }
}
