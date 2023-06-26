import type { Result } from "@fabernovel/heart-common"
import { ReportEntity, ServiceEntity } from "@fabernovel/heart-common"
import { MikroORM } from "@mikro-orm/core"
import { MySqlDriver, defineConfig } from "@mikro-orm/mysql"
import { TsMorphMetadataProvider } from "@mikro-orm/reflection"
import { env } from "node:process"

const DB_NAME = "heart"

export class MysqlClient {
  #ormPromise: Promise<MikroORM>

  constructor() {
    const clientConfig = defineConfig({
      clientUrl: env.HEART_MYSQL_URL as string,
      // avoid the use of folder based discovery.
      // this which will lead into the usage of the output directory name for JS files (lib/ at the moment) in the code.
      // having such name in the code is prone to error if this directory name change in the future.
      entities: [ReportEntity, ServiceEntity],
      metadataProvider: TsMorphMetadataProvider,
      name: DB_NAME,
    })

    this.#ormPromise = MikroORM.init<MySqlDriver>(clientConfig)
  }

  public async store(reportEntity: ReportEntity<Result>): Promise<void> {
    const orm = await this.#ormPromise

    return orm.em.persistAndFlush(reportEntity)
  }
}
