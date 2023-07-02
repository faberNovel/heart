import { type IDatabaseDriver, type Options } from "@mikro-orm/core"
import { TsMorphMetadataProvider } from "@mikro-orm/reflection"
import { ReportEntity } from "../../entities/ReportEntity.js"
import { ServiceEntity } from "../../entities/ServiceEntity.js"

const DB_NAME = "heart"

export function createDatabaseConfig<D extends IDatabaseDriver>(options: Options<D>): Options<D> {
  return {
    ...options,
    ...{
      dbName: DB_NAME,
      entities: [ReportEntity, ServiceEntity],
      metadataProvider: TsMorphMetadataProvider,
      migrations: {
        snapshot: false,
      },
    },
  }
}
