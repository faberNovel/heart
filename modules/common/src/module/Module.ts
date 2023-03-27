import type { Service } from "../service/Service.js"
import type { ModuleInterface } from "./ModuleInterface.js"

export abstract class Module implements ModuleInterface {
  id = ""
  readonly name: string
  readonly service: Service

  constructor(module: Pick<ModuleInterface, "name" | "service">) {
    this.name = module.name
    this.service = module.service
  }
}
