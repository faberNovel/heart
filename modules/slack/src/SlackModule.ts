import {
  Module,
  logger,
  type GenericReport,
  type ModuleListenerInterface,
  type ModuleMetadata,
  type Result,
} from "@fabernovel/heart-common"
import { Client } from "./api/Client.js"
import { formatBlocks } from "./formatter/BlocksFormatter.js"
import { formatText } from "./formatter/TextFormatter.js"

export class SlackModule extends Module implements ModuleListenerInterface {
  #slackClient: Client

  constructor(moduleMetadata: ModuleMetadata, verbose: boolean) {
    super(moduleMetadata, verbose)

    this.#slackClient = new Client(verbose)

    if (verbose) {
      logger.info(`${moduleMetadata.name} initialized.`)
    }
  }

  public async notifyAnalysisDone(report: GenericReport<Result>): Promise<unknown> {
    return this.#slackClient.postMessage({
      blocks: formatBlocks(report),
      text: formatText(report),
      icon_url: report.service.logoUrl,
      username: report.service.name,
    })
  }
}
