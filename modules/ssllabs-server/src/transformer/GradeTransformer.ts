import { SsllabsServerGrade } from "@fabernovel/heart-common"

/**
 * @see [Documentation ('grade' property)]{@link https://github.com/ssllabs/ssllabs-scan/blob/master/ssllabs-api-docs-v3.md#endpoint}
 */
const TRANSFORM_TABLE: { [key in SsllabsServerGrade]: number } = {
  "A+": 95, // equal repartition of the A grades (A+, A, A-) between 80 and 100
  A: 90,
  "A-": 85,
  B: 72.5, // average between 65 and 80
  C: 57.5, // average between 50 and 65
  D: 42.5, // average between 35 and 50
  E: 27.5, // average between 20 and 35
  F: 10, // average between 0 and 20
  T: 0,
  M: 0,
}

/**
 * Transform a grade (A+, A, A-, B, C...) into a percentage (number between 0 and 100)
 * @see [Methodology]{@link https://github.com/ssllabs/research/wiki/SSL-Server-Rating-Guide#methodology-overview}
 */
export const transform = (grade: keyof typeof SsllabsServerGrade): number => {
  return TRANSFORM_TABLE[grade]
}
