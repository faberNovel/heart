import { Module, ModuleInterface, ModuleListenerInterface, Report, Result } from "@fabernovel/heart-common"
import { Client } from "./api/Client.js"
import { formatBlocks, formatText } from "./formatter/ReportFormatter.js"

export class SlackModule extends Module implements ModuleListenerInterface {
  private slackClient: Client

  constructor(module: Pick<ModuleInterface, "name" | "service">) {
    super(module)

    this.slackClient = new Client()
  }

  public async notifyAnalysisDone<R extends Result>(report: Report<R>): Promise<unknown> {
    return this.slackClient.postMessage({
      blocks: formatBlocks(report),
      text: formatText(report),
      icon_url: report.service.logo,
      username: report.service.name,
    })
  }
}
