import { OperatorEnum } from "./Operators"
import { Thresholdable } from "./Thresholdable"

export type ThresholdInputType = {
  [key in OperatorEnum]?: Thresholdable
}
