import { GreenITResult, LighthouseResult, ObservatoryResult, Report, Result } from "@fabernovel/heart-common"
import { Block, DividerBlock, KnownBlock, MrkdwnElement, SectionBlock } from "@slack/web-api"
import { formatGreenITBlocks } from "./GreenITStatisticsFormatter.js"
import { formatLighthouseBlocks } from "./LighthouseStatisticsFormatter.js"
import { formatObservatoryBlocks } from "./ObservatoryStatisticsFormatter.js"

const isReportSupportedForStatistics = (
  report: Report<Result>
): report is Report<LighthouseResult> | Report<GreenITResult> | Report<ObservatoryResult> => {
  const supportedServiceNames = ["Google Lighthouse", "GreenIT Analysis", "Mozilla Observatory"]

  return supportedServiceNames.indexOf(report.service.name) !== -1
}

const createBlocks = (
  report: Report<Result>,
  metricsBlocks: MrkdwnElement[] = [],
  advicesBlocks: Array<DividerBlock | SectionBlock> = []
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

  if (report.isThresholdReached() !== undefined) {
    blocks.push({
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: report.isThresholdReached()
            ? `:white_check_mark: Threshold (${report.threshold as number}) reached`
            : `:warning: Threshold (${report.threshold as number}) not reached`,
        },
      ],
    })
  }

  if (advicesBlocks.length > 0) {
    advicesBlocks.unshift(
      {
        type: "divider",
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "*Advices*",
        },
      }
    )

    blocks.push(...advicesBlocks)
  }

  // if (report.resultUrl !== undefined) {
  //   blocks.push({
  //     type: "actions",
  //     elements: [
  //       {
  //         type: "button",
  //         text: {
  //           type: "plain_text",
  //           text: "View results",
  //         },
  //         url: report.resultUrl,
  //       },
  //     ],
  //   })
  // }

  return blocks
}

export const formatBlocks = (report: Report<Result>): Array<KnownBlock | Block> => {
  if (isReportSupportedForStatistics(report)) {
    let metricsBlocks = new Array<MrkdwnElement>()
    let advicesBlocks = new Array<SectionBlock>()

    if (report.service.name === "Google Lighthouse") {
      ;[metricsBlocks, advicesBlocks] = formatLighthouseBlocks(report as unknown as Report<LighthouseResult>)
    } else if (report.service.name === "GreenIT Analysis") {
      ;[metricsBlocks, advicesBlocks] = formatGreenITBlocks(report as unknown as Report<GreenITResult>)
    } else if (report.service.name === "Mozilla Observatory") {
      ;[metricsBlocks, advicesBlocks] = formatObservatoryBlocks(
        report as unknown as Report<ObservatoryResult>
      )
    }

    return createBlocks(report, metricsBlocks, advicesBlocks)
  } else {
    return createBlocks(report)
  }
}
