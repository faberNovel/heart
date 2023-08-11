import { Request } from "@fabernovel/heart-common"
import { AnalysisResponseInterface } from "./model/AnalysisResponseInterface"
import { ReportResponseInterface } from "./model/ReportResponseInterface"

export class Client {
  private readonly API_URL = "https://www.dareboost.com/api/0.5/"
  private readonly conf: object

  constructor() {
    this.conf = { token: process.env.DAREBOOST_API_TOKEN }
  }

  public async launchAnalysis(conf: object): Promise<AnalysisResponseInterface> {
    return Request.post(`${this.API_URL}analysis/launch`, { ...this.conf, ...conf })
  }

  public async getAnalysisReport(reportId: string): Promise<ReportResponseInterface> {
    return Request.post(`${this.API_URL}analysis/report`, { ...this.conf, reportId })
  }
}
