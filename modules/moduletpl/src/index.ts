import type { ModuleIndex, ModuleMetadata } from "@fabernovel/heart-common"
import { ModuleTplModule } from "./ModuleTplModule.js"

export const initialize: ModuleIndex["initialize"] = (moduleMetadata: ModuleMetadata, verbose: boolean) => {
  return new ModuleTplModule(moduleMetadata, verbose)
}
