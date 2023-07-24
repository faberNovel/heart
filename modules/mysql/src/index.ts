import type { ModuleMetadata } from "@fabernovel/heart-common"
import { MySQLModule } from "./MySQLModule.js"

export function initialize(moduleMetadata: ModuleMetadata) {
  return new MySQLModule(moduleMetadata)
}
