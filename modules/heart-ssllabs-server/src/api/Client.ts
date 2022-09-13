import { Request } from "@fabernovel/heart-core"
import { stringify } from "querystring"

import { Host } from "./model/Host"
import { Error, isError } from "./model/Error"
import { Status } from "./enum/Status"
import { SsllabsServerConfig } from "../config/Config"

export class Client {
  private readonly API_URL = "https://api.ssllabs.com/api/v3"
  private readonly SERVICE_URL = "https://www.ssllabs.com/ssltest/analyze.html?d="
  private conf: SsllabsServerConfig = { host: "" }

  public async launchAnalysis(conf: SsllabsServerConfig): Promise<Host> {
    this.conf = conf

    return this.requestApi()
  }

  public getProjectUrl(): string {
    return this.conf.host
  }

  public getAnalyzeUrl(): string {
    return this.SERVICE_URL + this.getProjectUrl()
  }

  public async getAnalysisReport(): Promise<Host> {
    // avoid starting a new analysis instead of requesting the results
    if ("string" === typeof this.conf.startNew) {
      delete this.conf.startNew
    }

    return this.requestApi()
  }

  private generateApiUrl(path: string): string {
    return `${this.API_URL}${path}?${stringify(this.conf)}`
  }

  private async requestApi(): Promise<Host> {
    const host = await Request.get<Host | Error>(this.generateApiUrl("/analyze"))

    if (isError(host)) {
      return Promise.reject({
        error: host.errors,
      })
    }

    if (host.status === Status.ERROR) {
      return Promise.reject({
        error: "error",
        message: host.statusMessage,
      })
    }

    return new Host(host)
  }
}
