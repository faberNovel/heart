import type { ModuleMetadata } from "@fabernovel/heart-common"
import { ObservatoryModule } from "./ObservatoryModule.js"

export function initialize(moduleMetadata: ModuleMetadata) {
  return new ObservatoryModule(moduleMetadata)
}
