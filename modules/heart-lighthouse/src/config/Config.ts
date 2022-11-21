import { Config as BaseConfig } from "@fabernovel/heart-core"

export type LighthouseConfig = BaseConfig & {
  url: string
  config?: LH.Config.Json
}
