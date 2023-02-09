import { Result } from "../Result"

/**
 * @see {@link https://github.com/mozilla/http-observatory/blob/master/httpobs/docs/api.md#scan}
 */
export type ObservatoryResult = Result & {
  // timestamp for when the scan completed
  end_time: string

  // final grade assessed upon a completed scan
  grade: string

  // whether the scan results are unlisted on the recent results page
  hidden: boolean

  // the entirety of the HTTP response headers
  response_headers: object

  // unique ID number assigned to the scan
  scan_id: number

  // final score assessed upon a completed (FINISHED) scan
  score: number

  // Mozilla risk likelihod indicator that is the equivalent of the grade (https://wiki.mozilla.org/Security/Standard_Levels)
  likelihood_indicator: string

  // timestamp for when the scan was first requested
  start_time: string

  // the current state of the scan (https://github.com/mozilla/http-observatory/blob/master/httpobs/docs/api.md#scanner-state)
  state: "ABORTED" | "FAILED" | "FINISHED" | "PENDING" | "STARTING" | "RUNNING"

  // the number of subtests that were assigned a fail result
  tests_failed: number

  // the number of subtests that were assigned a passing result
  tests_passed: number

  // the total number of tests available and assessed at the time of the scan
  tests_quantity: number
}
