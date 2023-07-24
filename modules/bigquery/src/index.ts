import type { ModuleMetadata } from "@fabernovel/heart-common"
import { BigQueryModule } from "./BigQueryModule.js"

export function initialize(moduleMetadata: ModuleMetadata) {
  return new BigQueryModule(moduleMetadata)
}
