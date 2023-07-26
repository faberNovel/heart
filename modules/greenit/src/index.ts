import type { ModuleIndex, ModuleMetadata } from "@fabernovel/heart-common"
import { GreenITModule } from "./GreenITModule.js"

export const initialize: ModuleIndex["initialize"] = (moduleMetadata: ModuleMetadata, verbose: boolean) => {
  return new GreenITModule(moduleMetadata, verbose)
}
