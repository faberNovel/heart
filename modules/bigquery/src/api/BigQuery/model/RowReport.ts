import { Result, Report } from "@fabernovel/heart-common"
import { BigQueryDatetime } from "@google-cloud/bigquery"
import { RecordRanking } from "./RecordRanking.js"
import { RecordService } from "./RecordService.js"
import { RecordThreshold } from "./RecordThreshold.js"
import { RecordUrl } from "./RecordUrl.js"

/**
 * Representation of a Report object in BigQuery
 */
export class RowReport<R extends Result> {
  public date: BigQueryDatetime
  public ranking: RecordRanking
  public service: RecordService
  public url: RecordUrl
  public threshold: RecordThreshold

  constructor(report: Report<R>) {
    this.date = new BigQueryDatetime(report.date.toISOString())
    this.ranking = new RecordRanking(report.note, Math.round(report.normalizedNote))
    this.service = new RecordService(report.service.name)
    this.url = new RecordUrl(report.analyzedUrl, report.resultUrl)
    this.threshold = new RecordThreshold(report.threshold, report.isThresholdReached())
  }
}
