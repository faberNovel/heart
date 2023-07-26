import type { ModuleIndex, ModuleMetadata } from "@fabernovel/heart-common"
import { TplModule } from "./TplModule.js"

export const initialize: ModuleIndex["initialize"] = (moduleMetadata: ModuleMetadata, verbose: boolean) => {
  return new TplModule(moduleMetadata, verbose)
}
