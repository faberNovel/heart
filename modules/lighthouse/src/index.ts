import type { ModuleIndex, ModuleMetadata } from "@fabernovel/heart-common"
import { LighthouseModule } from "./LighthouseModule.js"

export const initialize: ModuleIndex["initialize"] = (moduleMetadata: ModuleMetadata, verbose: boolean) => {
  return new LighthouseModule(moduleMetadata, verbose)
}
