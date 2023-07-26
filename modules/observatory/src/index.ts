import type { ModuleIndex, ModuleMetadata } from "@fabernovel/heart-common"
import { ObservatoryModule } from "./ObservatoryModule.js"

export const initialize: ModuleIndex["initialize"] = (moduleMetadata: ModuleMetadata, verbose: boolean) => {
  return new ObservatoryModule(moduleMetadata, verbose)
}
