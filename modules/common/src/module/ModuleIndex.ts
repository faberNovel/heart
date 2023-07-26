import type { Module } from "./Module.js"
import type { ModuleMetadata } from "./ModuleMetadata.js"

export interface ModuleIndex {
  initialize: (moduleMetadata: ModuleMetadata, verbose: boolean) => Module
}
