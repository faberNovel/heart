import {
  type GenericReport,
  Module,
  type ModuleListenerInterface,
  type Result,
} from "@fabernovel/heart-common"
import { PartialFailureError } from "@google-cloud/common/build/src/util.js"
import { BigQueryClient } from "./api/BigQuery/Client.js"
import { RowReport } from "./api/BigQuery/model/RowReport.js"

export class BigQueryModule extends Module implements ModuleListenerInterface {
  #bigqueryClient = new BigQueryClient()

  public async notifyAnalysisDone<R extends Result>(report: GenericReport<R>): Promise<unknown> {
    try {
      const table = await this.#bigqueryClient.table

      return table.insert(new RowReport(report))
    } catch (error) {
      if (error instanceof PartialFailureError) {
        error.errors?.forEach((error) => {
          console.error(error)
        })
      } else {
        console.error(error)
      }

      return Promise.reject()
    }
  }
}
