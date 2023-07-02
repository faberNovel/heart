import {
  Module,
  ReportEntity,
  type GenericReport,
  type ModuleListenerDatabaseInterface,
  type Result,
} from "@fabernovel/heart-common"
import { MikroORM } from "@mikro-orm/core"
import { type MySqlDriver } from "@mikro-orm/mysql"
import databaseConfig from "./config/mikro-orm.config.js"

function createDatabaseClient(): Promise<MikroORM> {
  return MikroORM.init<MySqlDriver>(databaseConfig)
}

export class MysqlModule extends Module implements ModuleListenerDatabaseInterface {
  public getDatabaseClient(): Promise<MikroORM> {
    return createDatabaseClient()
  }

  public async notifyAnalysisDone(report: GenericReport<Result>): Promise<void> {
    const orm = await createDatabaseClient()
    const reportEntity = new ReportEntity<Result>(report)

    return orm.em.persistAndFlush(reportEntity)
  }
}
