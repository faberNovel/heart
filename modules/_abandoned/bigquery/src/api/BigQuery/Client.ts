import { BigQuery, Dataset, Table } from "@google-cloud/bigquery"
import { prepareAuthentication } from "./Authentication.js"
import { DATASET_DEFINITION, TABLE_DEFINITION } from "./Definitions.js"

export class BigQueryClient {
  #table: Promise<Table>
  #bigqueryClient: BigQuery

  constructor() {
    prepareAuthentication()

    this.#bigqueryClient = new BigQuery()

    this.#table = this.#getOrCreateTable()
  }

  get table(): Promise<Table> {
    return this.#table
  }

  /**
   * Retrieve the dataset, or create it if it does not exist.
   */
  async #getOrCreateDataset(): Promise<Dataset> {
    let dataset = this.#bigqueryClient.dataset(DATASET_DEFINITION.ID)

    const [datasetExists] = await dataset.exists()

    if (!datasetExists) {
      // create the dataset if it does not exist
      const datasetResponse = await this.#bigqueryClient.createDataset(DATASET_DEFINITION.ID)
      dataset = datasetResponse[0]
    }

    return dataset
  }

  /**
   * Retrieve the table of the dataset.
   * Update it if it exists, or create it if not.
   */
  async #getOrCreateTable(): Promise<Table> {
    const dataset = await this.#getOrCreateDataset()

    let table = dataset.table(TABLE_DEFINITION.ID)

    const [tableExists] = await table.exists()

    if (tableExists) {
      // update the table if it exists
      await table.setMetadata(TABLE_DEFINITION.METADATA)
    } else {
      // create the table if it does not exist
      const tableResponse = await dataset.createTable(TABLE_DEFINITION.ID, TABLE_DEFINITION.METADATA)
      table = tableResponse[0]
    }

    return table
  }
}
