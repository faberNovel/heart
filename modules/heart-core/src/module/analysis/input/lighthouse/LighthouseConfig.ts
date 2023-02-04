import Config from "lighthouse/types/config"
import { Config as BaseConfig } from "../Config"

export type LighthouseConfig = BaseConfig & {
  url: string
  config?: Config.Json
}
