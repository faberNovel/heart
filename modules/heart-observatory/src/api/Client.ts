import { Request, ObservatoryConfig, ObservatoryResult } from "@fabernovel/heart-core"
import { Error, isError } from "./Error"

export class Client {
  private analyzeUrl: string
  private apiUrl: string
  private host = ""

  constructor() {
    this.analyzeUrl = process.env.OBSERVATORY_ANALYZE_URL as string
    this.apiUrl = process.env.OBSERVATORY_API_URL as string
  }

  public async launchAnalysis(conf: ObservatoryConfig): Promise<ObservatoryResult> {
    this.host = conf.host

    if (undefined === this.host) {
      return Promise.reject({
        error: "mandatory-parameter",
        message: '"host" is a mandatory parameter',
      })
    }

    const scan = await Request.post<ObservatoryResult | Error>(this.generateApiUrl("analyze"), conf, {
      [Request.HEADER_CONTENT_TYPE]: Request.HEADER_CONTENT_TYPE_X_WWW_FORM_URLENCODED,
    })

    // Observatory API is unconventional, and does not take advantage of http verbs :/
    if (isError(scan)) {
      return Promise.reject({
        error: scan["error"],
        message: scan["text"],
      })
    }

    if ("FAILED" === scan.state || "ABORTED" === scan.state) {
      return Promise.reject({
        error: "error",
        message: scan.state,
      })
    }

    return scan
  }

  public getProjectHost(): string {
    return this.host
  }

  public getAnalyzeUrl(): string {
    return this.analyzeUrl + this.getProjectHost()
  }

  public async getAnalysisReport(): Promise<ObservatoryResult> {
    return Request.get(this.generateApiUrl("analyze"))
  }

  private generateApiUrl(path: string): string {
    return `${this.apiUrl}${path}?host=${this.getProjectHost()}`
  }
}
