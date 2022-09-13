import { OperatorEnum } from "./Operators"
import { Thresholdable } from "./Thresholdable"

export type ThresholdOutputType = {
  [key in OperatorEnum]?: {
    ref: Thresholdable
    actual: Thresholdable
    result: boolean
  }
}
