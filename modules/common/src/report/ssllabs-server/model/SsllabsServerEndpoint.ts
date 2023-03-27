import type { SsllabsServerGrade } from "../enum/SsllabsServerGrade.js"

/**
 * @see [Documentation]{@link https://github.com/ssllabs/ssllabs-scan/blob/master/ssllabs-api-docs-v3.md#endpoint}
 */
export type SsllabsServerEndpoint = {
  ipAddress: string
  serverName: string
  statusMessage: string
  statusDetails: string
  statusDetailsMessage: string
  grade: SsllabsServerGrade
  gradeTrustIgnored?: SsllabsServerGrade
  futureGrade: string | null
  hasWarnings: string
  isExceptional?: string
  progress: number
  duration: number
  eta: number
  delegation: number
  /**
   * this field contains an EndpointDetails object.
   * It's not present by default, but can be enabled by using the "all" parameter to the analyze API call.
   * @see [Documentation]{@link https://github.com/ssllabs/ssllabs-scan/blob/master/ssllabs-api-docs-v3.md#endpointdetails }
   */
  details?: unknown
}
