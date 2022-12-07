import { Config } from "@fabernovel/heart-core"

/**
 * @see {@link https://github.com/mozilla/http-observatory/blob/master/httpobs/docs/api.md#invoke-assessment}
 */
export type ObservatoryConfig = Config & {
  host: string
  hidden?: boolean
  rescan?: boolean
}
