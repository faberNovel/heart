import Report from '../report/Report';

import { compare } from './Operators';
import { ThresholdOutputObject } from './ReportThresholdObject';

export function validateAgainstThresholds(report: Report)
    : { status: boolean, results: ThresholdOutputObject } {

    const output: ThresholdOutputObject = {};
    let status = true;

    for (const attribute in report.thresholds) {
        if (report.thresholds[attribute]) {
            output[attribute] = {};

            for (const operator in report.thresholds[attribute]) {
                if (report.thresholds[attribute][operator]) {
                    const value = report[attribute];
                    const ref = report.thresholds[attribute][operator];

                    if (!value) {
                        status = false;
                    }

                    output[attribute][operator] = {
                        result: compare(value, ref, operator),
                        actual: value,
                        ref
                    }

                    if (output[attribute][operator].result === false) {
                        status = false;
                    }
                }
            }
        }
    }

    return { status, results: output };
}
