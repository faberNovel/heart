import { Result } from "../../Result.js"
import { SsllabsServerStatus } from "../enum/SsllabsServerStatus.js"
import { SsllabsServerEndpoint } from "./SsllabsServerEndpoint.js"

/**
 * @see [Documentation]{@link https://github.com/ssllabs/ssllabs-scan/blob/master/ssllabs-api-docs-v3.md#host}
 */
export type SsllabsServerResult = Result & {
  host: string
  port: number
  protocol: string
  isPublic: boolean
  status: SsllabsServerStatus
  statusMessage: string
  startTime: string
  testTime: string
  engineVersion: string
  criteriaVersion: string
  endpoints: SsllabsServerEndpoint[]
}
