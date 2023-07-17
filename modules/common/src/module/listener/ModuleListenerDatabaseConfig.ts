import { type IDatabaseDriver, type Options } from "@mikro-orm/core"
import { TsMorphMetadataProvider } from "@mikro-orm/reflection"
import { ReportEntity } from "../../entities/ReportEntity.js"
import { ServiceEntity } from "../../entities/ServiceEntity.js"

const DB_NAME = "heart"

export function createDatabaseConfig<D extends IDatabaseDriver>(options: Options<D>): Options<D> {
  options.dbName = DB_NAME
  options.entities = [ReportEntity, ServiceEntity]
  options.metadataProvider = TsMorphMetadataProvider

  if (options.migrations) {
    options.migrations.snapshot = false
  }

  return options
}
