import type { Config } from "lighthouse"
import type { Config as BaseConfig } from "../Config.js"

export type LighthouseConfig = BaseConfig & {
  url: string
  config?: Config
}
