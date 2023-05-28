/**
 * The current state of the scan
 * @see {@link https://github.com/mozilla/http-observatory/blob/master/httpobs/docs/api.md#scanner-state}
 */
export enum ObservatoryScanState {
  ABORTED = "ABORTED",
  FAILED = "FAILED",
  FINISHED = "FINISHED",
  PENDING = "PENDING",
  STARTING = "STARTING",
  RUNNING = "RUNNING",
}
