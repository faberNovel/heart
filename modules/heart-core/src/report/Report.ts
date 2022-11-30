import { RawResult } from "../module/output/RawResult"
import { Service } from "../service/Service"
import { ReportInterface } from "./ReportInterface"

type ReportParams<R extends RawResult> = Pick<
  ReportInterface<R>,
  "analyzedUrl" | "date" | "rawResults" | "note" | "resultUrl" | "service" | "threshold"
> &
  Partial<Pick<ReportInterface<R>, "normalizedNote">>

/**
 * Define an analysis report that is shared between every Heart module.
 *
 * /!\ WARNING /!\
 * Be very careful if you change the Report class structure, as it could have an impact on every Heart module.
 */
export class Report<R extends RawResult> implements ReportInterface<R> {
  analyzedUrl: string
  date: Date
  rawResults: R
  note: string
  normalizedNote: number
  resultUrl?: string
  service: Service
  threshold?: number

  constructor(report: ReportParams<R>) {
    this.analyzedUrl = report.analyzedUrl
    this.date = report.date
    this.rawResults = report.rawResults
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
