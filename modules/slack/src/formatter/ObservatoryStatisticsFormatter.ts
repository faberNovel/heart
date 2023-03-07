import { ObservatoryResult, Report } from "@fabernovel/heart-common"
import { MrkdwnElement, SectionBlock } from "@slack/web-api"

export const formatObservatoryBlocks = (
  report: Report<ObservatoryResult>
): [MrkdwnElement[], SectionBlock[]] => {
  const advicesBlocks: SectionBlock[] = Object.values(report.result).map((category) => ({
    type: "section",
    text: {
      type: "plain_text",
      text: (category.pass ? ":white_check_mark:" : ":x:") + " " + category.score_description,
    },
  }))

  return [[], advicesBlocks]
}
