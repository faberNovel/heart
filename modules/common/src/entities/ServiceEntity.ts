import { Entity, PrimaryKey, Property } from "@mikro-orm/core"
import type { Service } from "../service/Service.js"

@Entity({ tableName: "service" })
export class ServiceEntity {
  @PrimaryKey()
  name!: Service["name"]

  @Property()
  logo?: Service["logo"]

  constructor(service: Service) {
    this.name = service.name
    this.logo = service.logo
  }
}
