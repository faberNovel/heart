import { RawResults } from "@fabernovel/heart-core"
import { Status } from "../enum/Status"
import { GradeTransformer } from "../transformer/GradeTransformer"
import { SsllabsServerEndpoint } from "./Endpoint"

/**
 * @see [Documentation]{@link https://github.com/ssllabs/ssllabs-scan/blob/master/ssllabs-api-docs-v3.md#host}
 */
export type SsllabsServerHost = RawResults & {
  host: string
  port: number
  protocol: string
  isPublic: boolean
  status: Status
  statusMessage: string
  startTime: string
  testTime: string
  engineVersion: string
  criteriaVersion: string
  endpoints: SsllabsServerEndpoint[]
}

/**
 * Retrieve the average endpoint percentage
 */
export function getAveragePercentage(endpoints: SsllabsServerEndpoint[]): number {
  const grades = endpoints.map((endpoint: SsllabsServerEndpoint) =>
    GradeTransformer.transform(endpoint.grade)
  )

  if (0 === grades.length) {
    return 0
  }

  const sumGrades = grades.reduce(
    (previousValue: number, currentValue: number) => previousValue + currentValue
  )

  return sumGrades / grades.length
}
