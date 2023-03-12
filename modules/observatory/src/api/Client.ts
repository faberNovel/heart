import { ObservatoryConfig, ObservatoryResult, Request } from "@fabernovel/heart-common"
import { env } from "node:process"
import { Error, isError } from "./Error.js"

export class Client {
  private analyzeUrl?: string
  private apiUrl?: string
  private host = ""

  public getAnalyzeUrl(): string {
    return (this.analyzeUrl ?? "") + this.host
  }

  /**
   * Get the summary of the analysis
   */
  public async requestScan(): Promise<ObservatoryResult["scan"]> {
    return Request.get(`${this.apiUrl ?? ""}analyze?host=${this.host}`)
  }

  /**
   * Get detailed results about the tests run
   */
  public async requestTests(scan: ObservatoryResult["scan"]): Promise<ObservatoryResult["tests"]> {
    return Request.get(`${this.apiUrl ?? ""}getScanResults?scan=${scan.scan_id}`)
  }

  public async triggerAnalysis(conf: ObservatoryConfig): Promise<ObservatoryResult["scan"]> {
    this.analyzeUrl = env.OBSERVATORY_ANALYZE_URL
    this.apiUrl = env.OBSERVATORY_API_URL
    this.host = conf.host

    if (undefined === this.host) {
      return Promise.reject({
        error: "mandatory-parameter",
        message: '"host" is a mandatory parameter',
      })
    }

    const scan = await Request.post<ObservatoryResult["scan"] | Error>(
      `${this.apiUrl ?? ""}analyze?host=${this.host}`,
      conf,
      {
        [Request.HEADER_CONTENT_TYPE]: Request.HEADER_CONTENT_TYPE_X_WWW_FORM_URLENCODED,
      }
    )

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
}
