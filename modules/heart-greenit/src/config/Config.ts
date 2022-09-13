import { Config } from "@fabernovel/heart-core"
import { Options } from "greenit-cli/cli-core/analysis"

export type GreenITConfig = Config &
  Options & {
    url: string
  }
