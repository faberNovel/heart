import type { Result } from "../Result.js"
import type { ObservatoryScan } from "./model/ObservatoryScan.js"
import type { ObservatoryTests } from "./model/ObservatoryTests.js"

export type ObservatoryResult = Result & {
  scan: ObservatoryScan
  tests: ObservatoryTests
}
