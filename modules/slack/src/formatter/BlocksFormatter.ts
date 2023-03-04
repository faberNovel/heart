import { GreenITResult, LighthouseResult, ObservatoryResult, Report, Result } from "@fabernovel/heart-common"
import { Block, KnownBlock, MrkdwnElement, PlainTextElement } from "@slack/web-api"
import { formatGreenITStatistics } from "./GreenITStatisticsFormatter.js"
import { formatLighthouseStatistics } from "./LighthouseStatisticsFormatter.js"
import { formatObservatoryStatistics } from "./ObservatoryStatisticsFormatter.js"

const ITEMS_PER_BLOCK = 10

const isReportSupportedForStatistics = (
  report: Report<Result>
): report is Report<LighthouseResult> | Report<GreenITResult> | Report<ObservatoryResult> => {
  const supportedServiceNames = ["Google Lighthouse", "GreenIT Analysis", "Mozilla Observatory"]

  return supportedServiceNames.indexOf(report.service.name) !== -1
}

const createHeaderBlocks = (report: Report<Result>) => {
  const fields = new Array<PlainTextElement | MrkdwnElement>(
    {
      type: "mrkdwn",
      text: "*Note*",
    },
    {
      type: "plain_text",
      text: `${report.note} (${report.normalizedNote}/100)`,
    }
  )

  if (report.isThresholdReached() !== undefined) {
    fields.push(
      {
        type: "mrkdwn",
        text: "*Threshold*",
      },
      {
        type: "mrkdwn",
        text: report.isThresholdReached() === true ? ":white_check_mark: Reached" : ":warning: Not reached",
      }
    )
  }

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
      fields: fields,
    },
  ]

  if (report.resultUrl !== undefined) {
    blocks.push({
      type: "actions",
      elements: [
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "View results",
          },
          url: report.resultUrl,
        },
      ],
    })
  }

  return blocks
}

const createStatisticsBlocks = (report: Report<Result>) => {
  const statistics = new Array<KnownBlock | Block>(
    {
      type: "header",
      text: {
        type: "plain_text",
        text: "Statistics & advices",
      },
    },
    {
      type: "divider",
    }
  )

  let fields = new Array<PlainTextElement | MrkdwnElement>()

  if (report.service.name === "Google Lighthouse") {
    fields = formatLighthouseStatistics(report as unknown as Report<LighthouseResult>)
  } else if (report.service.name === "GreenIT Analysis") {
    fields = formatGreenITStatistics(report as unknown as Report<GreenITResult>)
  } else if (report.service.name === "Mozilla Observatory") {
    fields = formatObservatoryStatistics(report as unknown as Report<ObservatoryResult>)
  }

  for (let i = 0; i < Math.ceil(fields.length / ITEMS_PER_BLOCK); i++) {
    const start = i * ITEMS_PER_BLOCK
    const end = start + ITEMS_PER_BLOCK

    const slice = fields.slice(start, end)

    statistics.push({
      type: "section",
      fields: slice,
    })
  }

  return statistics
}

export const formatBlocks = (report: Report<Result>): Array<KnownBlock | Block> => {
  const blocks = createHeaderBlocks(report)

  if (isReportSupportedForStatistics(report)) {
    const statisticsBlocks = createStatisticsBlocks(report)

    blocks.push(...statisticsBlocks)
  }

  return blocks
}
