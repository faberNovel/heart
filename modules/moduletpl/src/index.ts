import type { ModuleMetadata } from "@fabernovel/heart-common"
import { ModuleTplModule } from "./ModuleTplModule.js"

export function initialize(moduleMetadata: ModuleMetadata) {
  return new ModuleTplModule(moduleMetadata)
}
