import { GreenITResult, Report } from "@fabernovel/heart-common"
import { Block, KnownBlock } from "@slack/web-api"

/**
 * Formatting layout is inspired by https://www.ecoindex.fr/
 */
export const formatGreenITReport = (report: Report<GreenITResult>): Array<KnownBlock | Block> => {
  return [
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
        {
          type: "mrkdwn",
          text: "*Page weight*",
        },
        {
          type: "plain_text",
          text: `${(report.result.responsesSize / 1000000).toFixed(2)} Mo`,
        },
        {
          type: "mrkdwn",
          text: "*Page complexity (DOM elements)*",
        },
        {
          type: "plain_text",
          text: report.result.domSize.toString(),
        },
        {
          type: "mrkdwn",
          text: "*Network requests*",
        },
        {
          type: "mrkdwn",
          text: report.result.nbRequest.toString(),
        },
      ],
    },
  ]
}
