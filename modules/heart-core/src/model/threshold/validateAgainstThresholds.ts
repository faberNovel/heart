import {Report} from '../report/Report';

import { compare, OperatorEnum } from './Operators';
import { ThresholdInputObject, ThresholdOutputObject } from './ReportThresholdObject';

type ValidatedThreshold = {
  areThresholdsReached?: boolean,
  results?: ThresholdOutputObject
}

export function validateAgainstThresholds(report: Report, thresholds: ThresholdInputObject): ValidatedThreshold {
  const output: ThresholdOutputObject = {};
  const thresholdsResults: boolean[] = [];

  Object.entries(thresholds).forEach(([key, thresholdInputType]) => {
    const attribute = key as keyof ThresholdInputObject

    output[attribute] = {}

    Object.entries(thresholdInputType).forEach(([k, ref]) => {
      const operator = k as keyof typeof OperatorEnum

      const value = report[attribute];
      const result = compare(value, ref, operator)

      Object.defineProperty(output[attribute], operator, {
        enumerable: true,
        value: {
          result,
          actual: value,
          ref
        }
      })

      thresholdsResults.push(result)
    })
  })

  return { areThresholdsReached: thresholdsResults.every((r) => r === true), results: output };
}
