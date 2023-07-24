import type { ModuleMetadata } from "@fabernovel/heart-common"
import { LighthouseModule } from "./LighthouseModule.js"

export function initialize(moduleMetadata: ModuleMetadata) {
  return new LighthouseModule(moduleMetadata)
}
