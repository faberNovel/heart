import type { GenericReport, Result } from "@fabernovel/heart-common"

export const formatText = (report: GenericReport<Result>): string => {
  let text = `${report.analyzedUrl}: ${report.displayGrade()}`

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
