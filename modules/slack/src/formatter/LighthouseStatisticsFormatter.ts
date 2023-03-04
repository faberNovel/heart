import { LighthouseResult, Report } from "@fabernovel/heart-common"
import { MrkdwnElement, PlainTextElement } from "@slack/web-api"

export const formatLighthouseStatistics = (
  report: Report<LighthouseResult>
): Array<PlainTextElement | MrkdwnElement> => {
  const fields = new Array<PlainTextElement | MrkdwnElement>()

  for (const categoryId in report.result.categories) {
    const category = report.result.categories[categoryId]

    fields.push(
      {
        type: "mrkdwn",
        text: `*${category.title}*`,
      },
      {
        type: "plain_text",
        text: category.score === null ? "" : `${category.score * 100}/100`,
      }
    )
  }

  return fields
}
