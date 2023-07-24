import type { ModuleMetadata } from "./ModuleMetadata.js"

export abstract class Module implements ModuleMetadata {
  readonly id: ModuleMetadata["id"]
  readonly name: ModuleMetadata["name"]
  readonly service: ModuleMetadata["service"]
  readonly type: ModuleMetadata["type"]

  constructor(moduleMetadata: ModuleMetadata) {
    this.id = moduleMetadata.id
    this.name = moduleMetadata.name
    this.service = moduleMetadata.service
    this.type = moduleMetadata.type
  }
}
