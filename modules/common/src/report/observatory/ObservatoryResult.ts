import { Result } from "../Result.js"
import { Scan } from "./model/Scan.js"
import { Tests } from "./model/Tests.js"

export type ObservatoryResult = Result & {
  scan: Scan
  tests: Tests
}
