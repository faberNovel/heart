import { Request } from "@fabernovel/heart-core"
import { DareboostAnalyse } from "./model/Analyse"
import { DareboostResult } from "./model/Result"

export class Client {
  private readonly API_URL = "https://www.dareboost.com/api/0.5/"
  private readonly conf: object

  constructor() {
    this.conf = { token: process.env.DAREBOOST_API_TOKEN }
  }

  public async launchAnalysis(conf: object): Promise<DareboostAnalyse> {
    return Request.post(`${this.API_URL}analysis/launch`, { ...this.conf, ...conf })
  }

  public async getAnalysisReport(reportId: string): Promise<DareboostResult> {
    return Request.post(`${this.API_URL}analysis/report`, { ...this.conf, reportId })
  }
}
