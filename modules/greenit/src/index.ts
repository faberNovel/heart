import type { ModuleMetadata } from "@fabernovel/heart-common"
import { GreenITModule } from "./GreenITModule.js"

export function initialize(moduleMetadata: ModuleMetadata) {
  return new GreenITModule(moduleMetadata)
}
