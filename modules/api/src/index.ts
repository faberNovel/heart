import type { ModuleMetadata } from "@fabernovel/heart-common"
import { ApiModule } from "./ApiModule.js"

export function initialize(moduleMetadata: ModuleMetadata) {
  return new ApiModule(moduleMetadata)
}
