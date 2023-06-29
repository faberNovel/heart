import { MikroORM, type IDatabaseDriver, type Options } from "@mikro-orm/core"
import { TsMorphMetadataProvider } from "@mikro-orm/reflection"
import { ReportEntity } from "../../entities/ReportEntity.js"
import { ServiceEntity } from "../../entities/ServiceEntity.js"

const DB_NAME = "heart"

export function createDatabaseClient<D extends IDatabaseDriver>(
  defineConfig: (o: Options<D>) => Options<D>,
  databaseUrl: string
): Promise<MikroORM> {
  const clientConfig = defineConfig({
    clientUrl: databaseUrl,
    entities: [ReportEntity, ServiceEntity],
    metadataProvider: TsMorphMetadataProvider,
    name: DB_NAME,
  })

  return MikroORM.init<D>(clientConfig)
}
