import { Config } from "lighthouse"
import { Config as BaseConfig } from "../Config.js"

export type LighthouseConfig = BaseConfig & {
  url: string
  config?: Config
}
