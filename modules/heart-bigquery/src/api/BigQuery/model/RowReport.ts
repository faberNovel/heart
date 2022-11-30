import { RawResults, Report } from "@fabernovel/heart-core"
import { BigQueryDatetime } from "@google-cloud/bigquery"
import { RecordRanking } from "./RecordRanking"
import { RecordService } from "./RecordService"
import { RecordThreshold } from "./RecordThreshold"
import { RecordUrl } from "./RecordUrl"

/**
 * Representation of a Report object in BigQuery
 */
export class RowReport<R extends RawResults> {
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
