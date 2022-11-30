import { Request } from "@fabernovel/heart-core"
import { Analyse } from "./model/Analyse"
import { Result } from "./model/Result"

export class Client {
  private readonly API_URL = "https://www.dareboost.com/api/0.5/"
  private readonly conf: object

  constructor() {
    this.conf = { token: process.env.DAREBOOST_API_TOKEN }
  }

  public async launchAnalysis(conf: object): Promise<Analyse> {
    const options = { ...conf, headers: [{ name: "User-Agent", value: "Dareboost" }] }

    return Request.post(`${this.API_URL}analysis/launch`, { ...this.conf, ...options })
  }

  public async getAnalysisReport(reportId: string): Promise<Result> {
    return Request.post(`${this.API_URL}analysis/report`, { ...this.conf, reportId })
  }
}
