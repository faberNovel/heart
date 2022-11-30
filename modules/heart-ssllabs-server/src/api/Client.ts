import {
  Request,
  SsllabsServerConfig,
  SsllabsServerResult,
  SsllabsServerStatus,
} from "@fabernovel/heart-core"
import { stringify } from "querystring"
import { isSsllabsServerError, SsllabsServerError } from "./Error"

export class Client {
  private readonly API_URL = "https://api.ssllabs.com/api/v3"
  private readonly SERVICE_URL = "https://www.ssllabs.com/ssltest/analyze.html?d="
  private conf: SsllabsServerConfig = { host: "" }

  public async launchAnalysis(conf: SsllabsServerConfig): Promise<SsllabsServerResult> {
    this.conf = conf

    return this.requestApi()
  }

  public getProjectUrl(): string {
    return this.conf.host
  }

  public getAnalyzeUrl(): string {
    return this.SERVICE_URL + this.getProjectUrl()
  }

  public async getAnalysisReport(): Promise<SsllabsServerResult> {
    // avoid starting a new analysis instead of requesting the results
    if ("string" === typeof this.conf.startNew) {
      delete this.conf.startNew
    }

    return this.requestApi()
  }

  private generateApiUrl(path: string): string {
    return `${this.API_URL}${path}?${stringify(this.conf)}`
  }

  private async requestApi(): Promise<SsllabsServerResult> {
    const host = await Request.get<SsllabsServerResult | SsllabsServerError>(this.generateApiUrl("/analyze"))

    if (isSsllabsServerError(host)) {
      return Promise.reject({
        error: host.errors,
      })
    }

    if (host.status === SsllabsServerStatus.ERROR) {
      return Promise.reject({
        error: "error",
        message: host.statusMessage,
      })
    }

    return host
  }
}
