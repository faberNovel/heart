import {
  type GenericReport,
  GreenITReport,
  LighthouseReport,
  ObservatoryReport,
  type Result,
} from "@fabernovel/heart-common"
import type {
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

const createBlocks = (
  report: GenericReport<Result>,
  metricsBlocks: MrkdwnElement[] = [],
  advicesBlocks: (DividerBlock | HeaderBlock | SectionBlock)[] = []
) => {
  metricsBlocks.unshift({
    type: "mrkdwn",
    text: "*Overall*: " + report.displayGrade(),
  })

  const blocks: (KnownBlock | Block)[] = [
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
          ? `:white_check_mark: Threshold (${report.inputs.threshold ?? 0}) reached`
          : `:warning: Threshold (${report.inputs.threshold ?? 0}) not reached`,
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

export const formatBlocks = (report: GenericReport<Result>): (KnownBlock | Block)[] => {
  if (report instanceof LighthouseReport) {
    const [metricsBlocks, advicesBlocks] = formatLighthouseBlocks(report)
    return createBlocks(report, metricsBlocks, advicesBlocks)
  } else if (report instanceof GreenITReport) {
    const [metricsBlocks, advicesBlocks] = formatGreenITBlocks(report)
    return createBlocks(report, metricsBlocks, advicesBlocks)
  } else if (report instanceof ObservatoryReport) {
    const [metricsBlocks, advicesBlocks] = formatObservatoryBlocks(report)
    return createBlocks(report, metricsBlocks, advicesBlocks)
  } else {
    return createBlocks(report)
  }
}
