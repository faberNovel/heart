import {
  Module,
  type GenericReport,
  type ModuleListenerInterface,
  type Result,
  ReportEntity,
} from "@fabernovel/heart-common"
import { MysqlClient } from "./database/Client.js"

export class MysqlModule extends Module implements ModuleListenerInterface {
  #client = new MysqlClient()

  notifyAnalysisDone(report: GenericReport<Result>): Promise<void> {
    const reportEntity = new ReportEntity<Result>(report)

    return this.#client.store(reportEntity)
  }
}
