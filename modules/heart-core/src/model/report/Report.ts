import { ServiceInterface } from "../service/ServiceInterface"
import { validateAgainstThresholds } from "../threshold/validateAgainstThresholds"
import { ThresholdInputObject, ThresholdOutputObject } from "../threshold/ReportThresholdObject"

import { ReportInterface } from "./ReportInterface"

type ReportParams = Omit<ReportInterface, "normalizedNote"> & {
  normalizedNote?: number
}

/**
 * Define an analysis report that is shared between every Heart module.
 *
 * /!\ WARNING /!\
 * Be very careful if you change the Report class structure, as it could have an impact on every Heart module.
 */
export class Report implements ReportInterface {
  analyzedUrl: string
  date: Date
  note: string
  normalizedNote: number
  resultUrl?: string
  service: ServiceInterface

  thresholds?: ThresholdInputObject
  thresholdsResults?: ThresholdOutputObject
  areThresholdsReached?: boolean

  constructor(report: ReportParams) {
    this.analyzedUrl = report.analyzedUrl
    this.date = report.date
    this.note = report.note
    this.normalizedNote = report.normalizedNote ?? Number(this.note) ?? 0
    this.resultUrl = report.resultUrl
    this.service = report.service

    this.thresholds = report.thresholds
    if (this.thresholds && Object.keys(this.thresholds).length > 0) {
      const { areThresholdsReached, results } = validateAgainstThresholds(this, this.thresholds)

      this.areThresholdsReached = areThresholdsReached
      this.thresholdsResults = results
    }
  }
}
