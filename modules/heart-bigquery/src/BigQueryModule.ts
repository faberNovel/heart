import { AnalysisEvents, Module, ModuleInterface, ModuleListenerInterface, Report } from '@fabernovel/heart-core';
import { EventEmitter } from 'events';
import { ApiError } from '@google-cloud/common'
import {RowReport} from './api/BigQuery/model/RowReport';
import {BigQueryClient} from './api/BigQuery/Client';

export class BigQueryModule extends Module implements ModuleListenerInterface {
  private bigqueryClient: BigQueryClient;

  constructor(module: Omit<ModuleInterface, 'id'>) {
    super(module);

    this.bigqueryClient = new BigQueryClient();
  }

  /**
   * Register the events:
   * 1. take the events and their handlers from the mapping table
   * 2. register each event on the event emitter
   */
  public registerEvents(eventEmitter: EventEmitter): void {
    eventEmitter.on(AnalysisEvents.DONE, this.storeReport.bind(this));
  }

  private async storeReport(report: Report) {
    try {
      const table = await this.bigqueryClient.table;

      return await table.insert(new RowReport(report));
    } catch (error) {
      if (error instanceof ApiError && 'PartialFailureError' === error.name) {
        error.errors?.forEach((error) => {
          console.error(error)
        })
      } else {
        console.error(error)
      }

      throw error
    }
  }
}
