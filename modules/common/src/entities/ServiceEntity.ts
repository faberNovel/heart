import { Entity, PrimaryKey, Property } from "@mikro-orm/core"
import type { Service } from "../service/Service.js"

@Entity()
export class ServiceEntity {
  @Property()
  logo?: Service["logo"]

  @PrimaryKey()
  name!: Service["name"]

  constructor(service: Service) {
    this.name = service.name
    this.logo = service.logo
  }
}
