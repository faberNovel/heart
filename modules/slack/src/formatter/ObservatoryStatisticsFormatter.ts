import type { ObservatoryReport } from "@fabernovel/heart-common"
import type { MrkdwnElement, SectionBlock } from "@slack/web-api"

export const formatObservatoryBlocks = (report: ObservatoryReport): [MrkdwnElement[], SectionBlock[]] => {
  const advicesBlocks: SectionBlock[] = Object.values(report.result.tests).map((category) => ({
    type: "section",
    text: {
      type: "plain_text",
      text: (category.pass ? ":white_check_mark:" : ":x:") + " " + category.score_description,
    },
  }))

  return [[], advicesBlocks]
}
