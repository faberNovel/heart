import { Service } from "../service/Service"
import { ModuleInterface } from "./ModuleInterface"

export abstract class Module implements ModuleInterface {
  id = ""
  readonly name: string
  readonly service: Service

  constructor(module: Pick<ModuleInterface, "name" | "service">) {
    this.name = module.name
    this.service = module.service
  }
}
