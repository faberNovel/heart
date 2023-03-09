import { GreenITResult, Report } from "@fabernovel/heart-common"
import { MrkdwnElement, SectionBlock } from "@slack/web-api"
import { MAX_TEXT_BLOCK_LENGTH } from "./BlocksFormatter.js"

type Practice = {
  comment: string
  detailComment: string
}

/**
 * Formatting layout is inspired by https://www.ecoindex.fr/
 * @returns An array with the metrics and advices blocks (in that order)
 */
export const formatGreenITBlocks = (report: Report<GreenITResult>): [MrkdwnElement[], SectionBlock[]] => {
  const metricsBlocks: MrkdwnElement[] = [
    {
      type: "mrkdwn",
      text: `*Page weight*: ${(report.result.responsesSize / 1000000).toFixed(2)} Mo`,
    },
    {
      type: "mrkdwn",
      text: `*DOM elements*: ${report.result.domSize}`,
    },
    {
      type: "mrkdwn",
      text: `*Network requests*: ${report.result.nbRequest}`,
    },
  ]

  // only keep bestPractices that have comment and detailComment set (it seems that these are the ones that need improvement)
  const advicesBlocks: SectionBlock[][] = Object.values(report.result.bestPractices)
    .filter(
      (practice): practice is Practice =>
        Object.hasOwn(practice, "comment") && Object.hasOwn(practice, "detailComment")
    )
    .map((practice) => {
      // as the practice.detailComment could be more than MAX_TEXT_BLOCK_LENGTH characters long,
      // we need to create several sections.
      const lines = practice.detailComment.split("<br>").filter((line) => line.length > 0)

      const sections = new Array<SectionBlock>()

      let lineAcc = ""
      lines.forEach((line) => {
        const newLine = "\n- " + line
        if (lineAcc.length + newLine.length <= MAX_TEXT_BLOCK_LENGTH) {
          lineAcc += newLine
        } else {
          sections.push({
            type: "section",
            text: {
              type: "mrkdwn",
              text: lineAcc,
            },
          })
          lineAcc = newLine
        }
      })
      if (lineAcc.length > 0) {
        sections.push({
          type: "section",
          text: {
            type: "mrkdwn",
            text: lineAcc,
          },
        })
      }

      return [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*${practice.comment}*`,
          },
        },
        ...sections,
      ]
    })

  return [metricsBlocks, advicesBlocks.flat()]
}
