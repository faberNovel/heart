import { ObservatoryResult, Report } from "@fabernovel/heart-common"
import { MrkdwnElement, PlainTextElement } from "@slack/web-api"

export const formatObservatoryStatistics = (
  report: Report<ObservatoryResult>
): Array<PlainTextElement | MrkdwnElement> => {
  const fields = new Array<PlainTextElement | MrkdwnElement>()

  for (const categoryId in report.result) {
    const category = report.result[categoryId]

    fields.push(
      {
        type: "mrkdwn",
        text: `*${category.name}*`,
      },
      {
        type: "mrkdwn",
        text: (category.pass ? ":white_check_mark:" : ":x:") + " " + category.score_description,
      }
    )
  }

  return fields
}
