import {
  Module,
  type ModuleListenerInterface,
  type Result,
  type GenericReport,
} from "@fabernovel/heart-common"
import { Client } from "./api/Client.js"
import { formatBlocks } from "./formatter/BlocksFormatter.js"
import { formatText } from "./formatter/TextFormatter.js"

export class SlackModule extends Module implements ModuleListenerInterface {
  private slackClient = new Client()

  public async notifyAnalysisDone(report: GenericReport<Result>): Promise<unknown> {
    return this.slackClient.postMessage({
      blocks: formatBlocks(report),
      text: formatText(report),
      icon_url: report.service.logo,
      username: report.service.name,
    })
  }
}
