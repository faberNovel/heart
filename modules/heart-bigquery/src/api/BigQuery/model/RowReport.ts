import { Report } from '@fabernovel/heart-core';
import { BigQueryDatetime } from '@google-cloud/bigquery';

import RecordRanking from './RecordRanking';
import RecordService from './RecordService';
import RecordUrl from './RecordUrl';

/**
 * Representation of a Report object in BigQuery
 */
export default class RowReport {
  public date: BigQueryDatetime;
  public ranking: RecordRanking;
  public service: RecordService;
  public url: RecordUrl;

  constructor(report: Report) {
    this.date = new BigQueryDatetime(report.date.toISOString());
    this.ranking = new RecordRanking(report.note, report.normalizedNote);
    this.service = new RecordService(report.service.name);
    this.url = new RecordUrl(report.analyzedUrl, report.resultUrl);
  }
}
