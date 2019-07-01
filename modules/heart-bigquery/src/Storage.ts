import { AnalysisEvents, Report, StorageInterface } from '@fabernovel/heart-core';
import { InsertRowsResponse } from '@google-cloud/bigquery/build/src/table';
import { EventEmitter } from 'events';

import RowReport from './api/BigQuery/model/RowReport';
import BigQueryClient from './api/BigQuery/Client';

export default class Storage implements StorageInterface {
  private bigqueryClient: BigQueryClient;

  constructor() {
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

  private async storeReport(report: Report): Promise<InsertRowsResponse> {
    try {
      const table = await this.bigqueryClient.table;

      return await table.insert(new RowReport(report));
    } catch (e) {
      switch (true) {
        case 'PartialFailureError' === e.name:
          e.errors.forEach((error: any) => console.error(error));
          break;

        default:
            console.error(e);
          break;
      }
    }
  }
}
