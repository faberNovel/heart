import { Config } from "@fabernovel/heart-core"

/**
 * @see {@link https://github.com/ssllabs/ssllabs-scan/blob/master/ssllabs-api-docs-v3.md#invoke-assessment-and-check-progress}
 */
export type SsllabsServerConfig = Config & {
  /**
   * Hostname
   */
  host: string

  /**
   * Set to "on" if assessment results should be published on the public results boards optional, defaults to "off".
   */
  publish?: string

  /**
   * If set to "on" then cached assessment results are ignored and a new assessment is started.
   * However, if there's already an assessment in progress, its status is delivered instead.
   * This parameter should be used only once to initiate a new assessment
   * further invocations should omit it to avoid causing an assessment loop.
   */
  startNew?: string

  /**
   * Always deliver cached assessment reports if available optional, defaults to "off".
   * This parameter is intended for API consumers that don't want to wait for assessment results.
   * Can't be used at the same time as the startNew parameter.
   */
  fromCache?: string

  /**
   * Maximum report age, in hours, if retrieving from cache (fromCache parameter set).
   */
  maxAge?: number

  /**
   * By default this call results only summaries of individual endpoints.
   * If this parameter is set to "on", full information will be returned.
   * If set to "done", full information will be returned only if the assessment is complete (status is READY or ERROR).
   */
  all?: string

  /**
   * Set to "on" to proceed with assessments even when the server certificate doesn't match the assessment hostname.
   * Set to off by default. Please note that this parameter is ignored if a cached report is returned.
   */
  ignoreMismatch?: string
}
