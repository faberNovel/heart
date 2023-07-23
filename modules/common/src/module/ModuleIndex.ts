import winston from "winston"
import type { ModuleInterface } from "./ModuleInterface.js"

export interface ModuleIndex {
  initialize: (logger: winston.Logger) => ModuleInterface
}
