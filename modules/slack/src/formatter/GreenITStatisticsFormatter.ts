import { GreenITResult, Report } from "@fabernovel/heart-common"
import { MrkdwnElement, SectionBlock } from "@slack/web-api"

/**
 * Formatting layout is inspired by https://www.ecoindex.fr/
 * @returns An array with the metrics and advices blocks (in that order)
 */
export const formatGreenITBlocks = (report: Report<GreenITResult>): [MrkdwnElement[], SectionBlock[]] => {
  const metricsBlocks: MrkdwnElement[] = [
    {
      type: "mrkdwn",
      text: `*Page weight*: ${(report.result.responsesSize / 1000000).toFixed(2)} Mo`,
    },
    {
      type: "mrkdwn",
      text: `*DOM elements*: ${report.result.domSize}`,
    },
    {
      type: "mrkdwn",
      text: `*Network requests*: ${report.result.nbRequest}`,
    },
  ]

  return [metricsBlocks, []]
}
