import { GreenITResult, Report } from "@fabernovel/heart-common"
import { MrkdwnElement, PlainTextElement } from "@slack/web-api"

/**
 * Formatting layout is inspired by https://www.ecoindex.fr/
 */
export const formatGreenITStatistics = (
  report: Report<GreenITResult>
): Array<PlainTextElement | MrkdwnElement> => {
  return [
    {
      type: "mrkdwn",
      text: "*Page weight*",
    },
    {
      type: "plain_text",
      text: `${(report.result.responsesSize / 1000000).toFixed(2)} Mo`,
    },
    {
      type: "mrkdwn",
      text: "*Page complexity (DOM elements)*",
    },
    {
      type: "plain_text",
      text: report.result.domSize.toString(),
    },
    {
      type: "mrkdwn",
      text: "*Network requests*",
    },
    {
      type: "mrkdwn",
      text: report.result.nbRequest.toString(),
    },
  ]
}
