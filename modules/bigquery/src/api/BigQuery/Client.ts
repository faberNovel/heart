import { BigQuery, Dataset, Table } from "@google-cloud/bigquery"
import { Authentication } from "./Authentication.js"
import { Definitions } from "./Definitions.js"

export class BigQueryClient {
  private _table: Promise<Table>
  private bigqueryClient: BigQuery

  constructor() {
    Authentication.prepare()

    this.bigqueryClient = new BigQuery()

    this._table = this.getOrCreateTable()
  }

  get table(): Promise<Table> {
    return this._table
  }

  /**
   * Retrieve the dataset, or create it if it does not exist.
   */
  private async getOrCreateDataset(): Promise<Dataset> {
    let dataset = this.bigqueryClient.dataset(Definitions.DATASET.ID)

    const [datasetExists] = await dataset.exists()

    if (!datasetExists) {
      // create the dataset if it does not exist
      const datasetResponse = await this.bigqueryClient.createDataset(Definitions.DATASET.ID)
      dataset = datasetResponse[0]
    }

    return dataset
  }

  /**
   * Retrieve the table of the dataset.
   * Update it if it exists, or create it if not.
   */
  private async getOrCreateTable(): Promise<Table> {
    const dataset = await this.getOrCreateDataset()

    let table = dataset.table(Definitions.TABLE.ID)

    const [tableExists] = await table.exists()

    if (tableExists) {
      // update the table if it exists
      await table.setMetadata(Definitions.TABLE.METADATA)
    } else {
      // create the table if it does not exist
      const tableResponse = await dataset.createTable(Definitions.TABLE.ID, Definitions.TABLE.METADATA)
      table = tableResponse[0]
    }

    return table
  }
}
