import { SsllabsServerEndpoint } from "@fabernovel/heart-core"
import { transform } from "../transformer/GradeTransformer"

/**
 * Retrieve the average endpoint percentage
 */
export function getAveragePercentage(endpoints: SsllabsServerEndpoint[]): number {
  const grades = endpoints.map((endpoint: SsllabsServerEndpoint) => transform(endpoint.grade))

  if (0 === grades.length) {
    return 0
  }

  const sumGrades = grades.reduce(
    (previousValue: number, currentValue: number) => previousValue + currentValue
  )

  return sumGrades / grades.length
}
