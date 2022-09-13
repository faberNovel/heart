import { Config as BaseConfig } from "@fabernovel/heart-core"
import { Config } from "lighthouse"

export type LighthouseConfig = BaseConfig & {
  url: string
  config?: Config.Json
}
