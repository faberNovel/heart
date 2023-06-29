import {
  Module,
  ReportEntity,
  createDatabaseClient,
  type GenericReport,
  type ModuleListenerDatabaseInterface,
  type Result,
} from "@fabernovel/heart-common"
import type { MikroORM } from "@mikro-orm/core"
import { defineConfig, type MySqlDriver } from "@mikro-orm/mysql"
import { env } from "node:process"

export class MysqlModule extends Module implements ModuleListenerDatabaseInterface {
  #client = createDatabaseClient<MySqlDriver>(defineConfig, env.HEART_MYSQL_URL as string)

  getDatabaseClient(): Promise<MikroORM> {
    return this.#client
  }

  async notifyAnalysisDone(report: GenericReport<Result>): Promise<void> {
    const orm = await this.#client
    const reportEntity = new ReportEntity<Result>(report)

    return orm.em.persistAndFlush(reportEntity)
  }
}
