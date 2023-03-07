import { LighthouseResult, Report } from "@fabernovel/heart-common"
import { MrkdwnElement, SectionBlock } from "@slack/web-api"

export const formatLighthouseBlocks = (
  report: Report<LighthouseResult>
): [MrkdwnElement[], SectionBlock[]] => {
  const metricsBlocks: MrkdwnElement[] = Object.values(report.result.categories)
    .sort((a, b) => (a.title < b.title ? -1 : 0))
    .map((category) => ({
      type: "mrkdwn",
      text: `*${category.title}*: ${category.score === null ? "" : `${category.score * 100}/100`}`,
    }))

  return [metricsBlocks, []]
}
