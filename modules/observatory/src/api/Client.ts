import { type ObservatoryConfig, ObservatoryReport, Request } from "@fabernovel/heart-common"
import { env } from "node:process"
import { type ScanError, isScanError } from "./error/Error.js"

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
  public async requestScan(): Promise<ObservatoryReport["result"]["scan"]> {
    return Request.get(`${this.apiUrl ?? ""}analyze?host=${this.host}`)
  }

  /**
   * Get detailed results about the tests run
   */
  public async requestTests(
    scan: ObservatoryReport["result"]["scan"]
  ): Promise<ObservatoryReport["result"]["tests"]> {
    return Request.get(`${this.apiUrl ?? ""}getScanResults?scan=${scan.scan_id}`)
  }

  public async triggerAnalysis(conf: ObservatoryConfig): Promise<ObservatoryReport["result"]["scan"]> {
    this.analyzeUrl = env.OBSERVATORY_ANALYZE_URL
    this.apiUrl = env.OBSERVATORY_API_URL
    this.host = conf.host

    const scan = await Request.post<ObservatoryReport["result"]["scan"] | ScanError>(
      `${this.apiUrl ?? ""}analyze?host=${this.host}`,
      {
        host: conf.host,
        hidden: conf.hidden,
        rescan: conf.rescan,
      }
    )

    // Observatory API is unconventional, and does not take advantage of http verbs :/
    if (isScanError(scan)) {
      return Promise.reject({
        error: scan.error,
        message: scan.text,
      })
    }

    return scan
  }
}
