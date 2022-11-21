import {
  AnalysisEvents,
  Module,
  ModuleInterface,
  ModuleListenerInterface,
  Report,
} from "@fabernovel/heart-core"
import { PartialFailureError } from "@google-cloud/common/build/src/util"
import { EventEmitter } from "events"
import { BigQueryClient } from "./api/BigQuery/Client"
import { RowReport } from "./api/BigQuery/model/RowReport"

export class BigQueryModule extends Module implements ModuleListenerInterface {
  private bigqueryClient: BigQueryClient

  constructor(module: Omit<ModuleInterface, "id">) {
    super(module)

    this.bigqueryClient = new BigQueryClient()
  }

  /**
   * Register the events:
   * 1. take the events and their handlers from the mapping table
   * 2. register each event on the event emitter
   */
  public registerEvents(eventEmitter: EventEmitter): void {
    eventEmitter.on(AnalysisEvents.DONE, this.storeReport.bind(this))
  }

  private storeReport(report: Report) {
    this.bigqueryClient.table
      .then((table) => table.insert(new RowReport(report)))
      .catch((error) => {
        if (error instanceof PartialFailureError) {
          error.errors?.forEach((error) => {
            console.error(error)
          })
        } else {
          console.error(error)
        }
      })
  }
}
