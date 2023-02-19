import { Helper, Module, ModuleAnalysisInterface, ModuleInterface, Report } from "@fabernovel/heart-common"
import { ReportResponseInterface } from "./api/model/ReportResponseInterface"
import { Client } from "./api/Client"
import { DareboostConfig } from "./config/Config"

export class DareboostModule extends Module implements ModuleAnalysisInterface<DareboostConfig> {
  private readonly MAX_TRIES = 500
  private readonly TIME_BETWEEN_TRIES = 5000

  private conf: DareboostConfig = { url: "" }
  private apiClient: Client
  private threshold?: number

  constructor(module: Omit<ModuleInterface, "id">) {
    super(module)

    this.apiClient = new Client()
  }

  public async startAnalysis(conf: DareboostConfig, threshold?: number): Promise<Report> {
    this.conf = conf
    this.threshold = threshold

    const analysisResponse = await this.apiClient.launchAnalysis(this.conf)

    return this.requestReport(analysisResponse.reportId)
  }

  private async requestReport(reportId: string, triesQty = 1): Promise<Report> {
    if (triesQty > this.MAX_TRIES) {
      throw new Error(
        `The maximum number of tries (${this.MAX_TRIES}) to retrieve the report has been reached.`
      )
    }

    const reportResponse = await this.apiClient.getAnalysisReport(reportId)

    return this.handleResponseStatus(reportResponse, reportId, triesQty)
  }

  private async handleResponseStatus(
    reportResponse: ReportResponseInterface,
    reportId: string,
    triesQty: number
  ): Promise<Report> {
    switch (reportResponse.status) {
      case 202:
        await Helper.timeout(this.TIME_BETWEEN_TRIES)
        return this.requestReport(reportId, ++triesQty)

      case 200:
        return new Report({
          analyzedUrl: this.conf.url,
          date: new Date(reportResponse.report.date),
          service: this.service,
          resultUrl: reportResponse.report.publicReportUrl,
          note: reportResponse.report.summary.score.toString(),
          normalizedNote: reportResponse.report.summary.score,
          threshold: this.threshold,
        })

      default:
        throw new Error(reportResponse.message)
    }
  }
}
