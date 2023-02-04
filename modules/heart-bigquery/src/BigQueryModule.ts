import { Module, ModuleInterface, ModuleListenerInterface, Result, Report } from "@fabernovel/heart-core"
import { PartialFailureError } from "@google-cloud/common/build/src/util"
import { BigQueryClient } from "./api/BigQuery/Client"
import { RowReport } from "./api/BigQuery/model/RowReport"

export class BigQueryModule extends Module implements ModuleListenerInterface {
  private bigqueryClient: BigQueryClient

  constructor(module: Omit<ModuleInterface, "id">) {
    super(module)

    this.bigqueryClient = new BigQueryClient()
  }

  public async notifyAnalysisDone<R extends Result>(report: Report<R>): Promise<void> {
    try {
      const table = await this.bigqueryClient.table

      await table.insert(new RowReport(report))
    } catch (error) {
      if (error instanceof PartialFailureError) {
        error.errors?.forEach((error) => {
          console.error(error)
        })
      } else {
        console.error(error)
      }
    }
  }
}
