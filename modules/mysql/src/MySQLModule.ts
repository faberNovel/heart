import {
  Module,
  type GenericReport,
  type ModuleListenerDatabaseInterface,
  type Result,
  type ModuleInterface,
  logger,
} from "@fabernovel/heart-common"
import { MySQLClient } from "./client/Client.js"

export class MySQLModule extends Module implements ModuleListenerDatabaseInterface {
  #client: MySQLClient

  constructor(module: Pick<ModuleInterface, "name" | "service">) {
    super(module)
    this.#client = new MySQLClient()
  }

  public async hasPendingMigrations(): Promise<boolean> {
    const migrator = await this.#client.getMigrator()

    const migrations = await migrator.getPendingMigrations()

    return migrations.length > 0
  }

  public async runPendingMigrations(): Promise<void> {
    const migrator = await this.#client.getMigrator()

    await migrator.up()
  }

  public async notifyAnalysisDone(report: GenericReport<Result>): Promise<void> {
    try {
      await this.#client.save(report)
    } catch (error) {
      logger.error(error)
      return Promise.reject(error)
    }
  }
}
