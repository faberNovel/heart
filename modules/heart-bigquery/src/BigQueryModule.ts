import { AnalysisEvents, Module, ModuleInterface, ModuleListenerInterface, ReportInterface } from '@fabernovel/heart-core';
import { EventEmitter } from 'events';

import RowReport from './api/BigQuery/model/RowReport';
import BigQueryClient from './api/BigQuery/Client';

export default class BigQueryModule extends Module implements ModuleListenerInterface {
  private bigqueryClient: BigQueryClient;

  constructor(module: Partial<ModuleInterface>) {
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

  private async storeReport<A>(report: ReportInterface<A>) {
    try {
      const table = await this.bigqueryClient.table;

      return await table.insert(new RowReport(report));
    } catch (error) {
      switch (true) {
        case 'PartialFailureError' === error.name:
          error.errors.forEach((error: any) => console.error(error));
          break;

        default:
            console.error(error);
          break;
      }
    }
  }
}
