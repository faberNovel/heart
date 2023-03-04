import { Module, ModuleInterface, ModuleListenerInterface, Result, Report } from "@fabernovel/heart-common"
import { PartialFailureError } from "@google-cloud/common/build/src/util.js"
import { BigQueryClient } from "./api/BigQuery/Client.js"
import { RowReport } from "./api/BigQuery/model/RowReport.js"

export class BigQueryModule extends Module implements ModuleListenerInterface {
  private bigqueryClient: BigQueryClient

  constructor(module: Pick<ModuleInterface, "name" | "service">) {
    super(module)

    this.bigqueryClient = new BigQueryClient()
  }

  public async notifyAnalysisDone<R extends Result>(report: Report<R>): Promise<unknown> {
    try {
      const table = await this.bigqueryClient.table

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
