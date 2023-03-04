import { GreenITResult, LighthouseResult, Report, Result } from "@fabernovel/heart-common"
import { Block, KnownBlock } from "@slack/web-api"
import { formatGreenITStatistics } from "./GreenITStatisticsFormatter.js"
import { formatLighthouseStatistics } from "./LighthouseStatisticsFormatter.js"

export const formatBlocks = (report: Report<Result>): Array<KnownBlock | Block> => {
  const blocks: Array<KnownBlock | Block> = [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: report.analyzedUrl,
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
      fields: [
        {
          type: "mrkdwn",
          text: "*Note*",
        },
        {
          type: "plain_text",
          text: `${report.note} (${report.normalizedNote}/100)`,
        },
        {
          type: "mrkdwn",
          text: "*Threshold*",
        },
        {
          type: "mrkdwn",
          text: report.isThresholdReached() === true ? ":white_check_mark: Reached" : ":warning: Not reached",
        },
      ],
    },
  ]

  switch (report.service.name) {
    case "GreenIT Analysis":
      blocks.push(
        {
          type: "header",
          text: {
            type: "plain_text",
            text: "Statistics",
          },
        },
        {
          type: "divider",
        },
        {
          type: "section",
          fields: formatGreenITStatistics(report as unknown as Report<GreenITResult>),
        }
      )
      break
    case "Google Lighthouse":
      blocks.push(
        {
          type: "header",
          text: {
            type: "plain_text",
            text: "Statistics",
          },
        },
        {
          type: "divider",
        },
        {
          type: "section",
          fields: formatLighthouseStatistics(report as unknown as Report<LighthouseResult>),
        }
      )
      break
    default:
  }

  return blocks
}

export const formatText = (report: Report<Result>): string => {
  let text = `${report.analyzedUrl}: ${report.note} (${report.normalizedNote}/100)`

  if (report.resultUrl) {
    text += `. <${report.resultUrl}|view full report>`
  }

  if (report.isThresholdReached() === true) {
    text += "\n:white_check_mark: Your threshold is reached."
  } else if (report.isThresholdReached() === false) {
    text += "\n:warning: Your threshold is not reached."
  }

  return text
}
