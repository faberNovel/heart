import { ReportInterface } from '@fabernovel/heart-core';
import { BigQueryDatetime } from '@google-cloud/bigquery';

import RecordService from './RecordService';
import RecordUrl from './RecordUrl';

/**
 * Representation of a Report object in BigQuery
 */
export default class RowReport<A> {
  public date: BigQueryDatetime;
  public service: RecordService;
  public url: RecordUrl;

  constructor(report: ReportInterface<A>) {
    this.date = new BigQueryDatetime(report.date.toISOString());

    // TODO: what do we do with ranking?
    // this.ranking = new RecordRanking(report.note, report.normalizedNote);

    this.service = new RecordService(report.service.name);
    this.url = new RecordUrl(report.analyzedUrl, report.resultUrl);
  }
}
