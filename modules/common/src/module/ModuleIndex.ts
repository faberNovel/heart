import type { ModuleInterface } from "./ModuleInterface.js"

export interface ModuleIndex {
  initialize: () => ModuleInterface
}
