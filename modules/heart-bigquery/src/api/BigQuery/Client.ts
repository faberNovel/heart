import { BigQuery, Dataset } from '@google-cloud/bigquery';
import { Table } from '@google-cloud/bigquery/build/src/table';

import {Authentication} from './Authentication';
import {Definitions} from './Definitions';

export class BigQueryClient {
  private _table: Promise<Table>;
  private bigqueryClient: BigQuery;

  constructor() {
    Authentication.prepare();

    this.bigqueryClient = new BigQuery();

    this._table = this.getOrCreateTable();
  }

  get table(): Promise<Table> {
    return this._table;
  }

  /**
   * Retrieve the dataset, or create it if it does not exist.
   */
  private async getOrCreateDataset(): Promise<Dataset> {
    let dataset = this.bigqueryClient.dataset(Definitions.DATASET.ID);

    // create the dataset if it does not exist
    const [datasetExists] = await dataset.exists();
    if (!datasetExists) {
      [dataset] = await this.bigqueryClient.createDataset(Definitions.DATASET.ID);
    }

    return dataset;
  }

  /**
   * Retrieve the table of the dataset, or create it if it does not exist.
   */
  private async getOrCreateTable() {
    const dataset = await this.getOrCreateDataset();

    let table = dataset.table(Definitions.TABLE.ID);

    // create the table if it does not exist
    const [tableExists] = await table.exists();
    if (!tableExists) {
      [table] = await dataset.createTable(Definitions.TABLE.ID, Definitions.TABLE.METADATA);
    }

    return table;
  }
}
