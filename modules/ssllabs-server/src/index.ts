import type { ModuleMetadata } from "@fabernovel/heart-common"
import { SsllabsServerModule } from "./SsllabsServerModule.js"

export function initialize(moduleMetadata: ModuleMetadata) {
  return new SsllabsServerModule(moduleMetadata)
}
