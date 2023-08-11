import {
  Module,
  logger,
  type GenericReport,
  type ModuleListenerInterface,
  type ModuleMetadata,
  type Result,
} from "@fabernovel/heart-common"
import { PartialFailureError } from "@google-cloud/common/build/src/util.js"
import { BigQueryClient } from "./api/BigQuery/Client.js"
import { RowReport } from "./api/BigQuery/model/RowReport.js"

export class BigQueryModule extends Module implements ModuleListenerInterface {
  #bigqueryClient: BigQueryClient

  constructor(moduleMetadata: ModuleMetadata, verbose: boolean) {
    super(moduleMetadata, verbose)

    this.#bigqueryClient = new BigQueryClient()

    if (verbose) {
      logger.info(`${moduleMetadata.name} initialized.`)
    }
  }

  public async notifyAnalysisDone<R extends Result>(report: GenericReport<R>): Promise<unknown> {
    try {
      const table = await this.#bigqueryClient.table

      return table.insert(new RowReport(report))
    } catch (error) {
      if (error instanceof PartialFailureError) {
        error.errors?.forEach((error) => {
          logger.error(error)
        })
      } else {
        logger.error(error)
      }

      return Promise.reject()
    }
  }
}
