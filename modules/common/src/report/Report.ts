import { Result } from "../module/analysis/output/Result.js"
import { Service } from "../service/Service.js"
import { ReportInterface } from "./ReportInterface.js"

type ReportParams<R extends Result> = Pick<
  ReportInterface<R>,
  "analyzedUrl" | "date" | "result" | "note" | "resultUrl" | "service" | "threshold"
> &
  Partial<Pick<ReportInterface<R>, "normalizedNote">>

/**
 * Define an analysis report that is shared between every Heart module.
 *
 * /!\ WARNING /!\
 * Be very careful if you change the Report class structure, as it could have an impact on every Heart module.
 */
export class Report<R extends Result> implements ReportInterface<R> {
  analyzedUrl: string
  date: Date
  result: R
  note: string
  normalizedNote: number
  resultUrl?: string
  service: Service
  threshold?: number

  constructor(report: ReportParams<R>) {
    this.analyzedUrl = report.analyzedUrl
    this.date = report.date
    this.result = report.result
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
