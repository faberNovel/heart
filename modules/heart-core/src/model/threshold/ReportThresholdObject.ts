import { ThresholdInputType } from "./ThresholdInputType"
import { ThresholdOutputType } from "./ThresholdOutputType"

export type ThresholdInputObject = {
  normalizedNote?: Partial<ThresholdInputType>
}

export type ThresholdOutputObject = {
  normalizedNote?: Partial<ThresholdOutputType>
}
