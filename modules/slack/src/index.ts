import type { ModuleMetadata } from "@fabernovel/heart-common"
import { SlackModule } from "./SlackModule.js"

export function initialize(moduleMetadata: ModuleMetadata) {
  return new SlackModule(moduleMetadata)
}
