import type { Result } from "../Result.js"
import type { Scan } from "./model/Scan.js"
import type { Tests } from "./model/Tests.js"

export type ObservatoryResult = Result & {
  scan: Scan
  tests: Tests
}
