import type { ModuleIndex, ModuleMetadata } from "@fabernovel/heart-common"
import { BigQueryModule } from "./BigQueryModule.js"

export const initialize: ModuleIndex["initialize"] = (moduleMetadata: ModuleMetadata, verbose: boolean) => {
  return new BigQueryModule(moduleMetadata, verbose)
}
