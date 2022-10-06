import { ServiceInterface } from "../service/ServiceInterface"

import { ReportInterface } from "./ReportInterface"

type ReportParams = Pick<
  ReportInterface,
  "analyzedUrl" | "date" | "note" | "resultUrl" | "service" | "threshold"
> &
  Partial<Pick<ReportInterface, "normalizedNote">>

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
  threshold?: number

  constructor(report: ReportParams) {
    this.analyzedUrl = report.analyzedUrl
    this.date = report.date
    this.note = report.note
    this.normalizedNote = report.normalizedNote ?? Number(this.note) ?? 0
    this.resultUrl = report.resultUrl
    this.service = report.service
    this.threshold = report.threshold
  }

  isThresholdReached(): boolean | undefined {
    return this.threshold ? this.normalizedNote >= this.threshold : undefined
  }
}
