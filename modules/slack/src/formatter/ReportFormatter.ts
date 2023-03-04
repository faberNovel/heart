import { GreenITResult, Report, Result } from "@fabernovel/heart-common"
import { Block, KnownBlock } from "@slack/web-api"
import { formatGreenITReport } from "./GreenITReportFormatter.js"

export const formatBlock = (report: Report<Result>): Array<KnownBlock | Block> => {
  switch (report.service.name) {
    case "GreenIT Analysis":
      return formatGreenITReport(report as unknown as Report<GreenITResult>)
    default:
      return []
  }
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
