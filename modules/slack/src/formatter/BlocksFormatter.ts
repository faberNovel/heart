import { GreenITResult, LighthouseResult, ObservatoryResult, Report, Result } from "@fabernovel/heart-common"
import {
  Block,
  DividerBlock,
  HeaderBlock,
  ImageElement,
  KnownBlock,
  MrkdwnElement,
  PlainTextElement,
  SectionBlock,
} from "@slack/web-api"
import { formatGreenITBlocks } from "./GreenITStatisticsFormatter.js"
import { formatLighthouseBlocks } from "./LighthouseStatisticsFormatter.js"
import { formatObservatoryBlocks } from "./ObservatoryStatisticsFormatter.js"

// maximum number of characters in a text block
export const MAX_TEXT_BLOCK_LENGTH = 3000

const isReportSupportedForStatistics = (
  report: Report<Result>
): report is Report<LighthouseResult> | Report<GreenITResult> | Report<ObservatoryResult> => {
  const supportedServiceNames = ["Google Lighthouse", "GreenIT Analysis", "Mozilla Observatory"]

  return supportedServiceNames.indexOf(report.service.name) !== -1
}

const createBlocks = (
  report: Report<Result>,
  metricsBlocks: MrkdwnElement[] = [],
  advicesBlocks: Array<DividerBlock | HeaderBlock | SectionBlock> = []
) => {
  metricsBlocks.unshift({
    type: "mrkdwn",
    text: "*Overall*: " + report.displayNote(),
  })

  const blocks: Array<KnownBlock | Block> = [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: `Results for ${report.analyzedUrl}`,
      },
    },
    {
      type: "divider",
    },
    {
      type: "section",
      accessory: {
        type: "image",
        image_url: report.service.logo ?? "",
        alt_text: report.service.name,
      },
      fields: metricsBlocks,
    },
  ]

  if (report.resultUrl !== undefined || report.isThresholdReached() !== undefined) {
    const elements = new Array<ImageElement | PlainTextElement | MrkdwnElement>()

    if (report.isThresholdReached() !== undefined) {
      elements.push({
        type: "mrkdwn",
        text: report.isThresholdReached()
          ? `:white_check_mark: Threshold (${report.threshold as number}) reached`
          : `:warning: Threshold (${report.threshold as number}) not reached`,
      })
    }

    if (report.resultUrl !== undefined) {
      elements.push({
        type: "mrkdwn",
        text: `<${report.resultUrl}|View full report>`,
      })
    }

    blocks.push({
      type: "context",
      elements: elements,
    })
  }

  if (advicesBlocks.length > 0) {
    advicesBlocks.unshift(
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "Advices",
        },
      },
      {
        type: "divider",
      }
    )

    blocks.push(...advicesBlocks)
  }

  return blocks
}

export const formatBlocks = (report: Report<Result>): Array<KnownBlock | Block> => {
  if (isReportSupportedForStatistics(report)) {
    if (report.service.name === "Google Lighthouse") {
      const [metricsBlocks, advicesBlocks] = formatLighthouseBlocks(
        report as unknown as Report<LighthouseResult>
      )
      return createBlocks(report, metricsBlocks, advicesBlocks)
    } else if (report.service.name === "GreenIT Analysis") {
      const [metricsBlocks, advicesBlocks] = formatGreenITBlocks(report as unknown as Report<GreenITResult>)
      return createBlocks(report, metricsBlocks, advicesBlocks)
    } else {
      // Mozilla Observatory
      const [metricsBlocks, advicesBlocks] = formatObservatoryBlocks(
        report as unknown as Report<ObservatoryResult>
      )
      return createBlocks(report, metricsBlocks, advicesBlocks)
    }
  } else {
    return createBlocks(report)
  }
}
