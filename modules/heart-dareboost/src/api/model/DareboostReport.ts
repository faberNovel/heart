import { ReportArguments, ReportInterface, ReportUtils, ServiceInterface } from '@fabernovel/heart-core';

import ReportResponseInterface from './ReportResponseInterface';

export type DareboostReportType = ReportResponseInterface;

export default class DareboostReport implements ReportInterface<DareboostReportType> {
  analyzedUrl: string;
  date: Date;
  resultUrl?: string;
  service: ServiceInterface;
  value: DareboostReportType;

  constructor(report: ReportArguments<DareboostReportType>) {
    Object.assign(this, report);
  }

  getNote() {
    return this.value.report.summary.score.toString();
  }

  getNormalizedNote() {
    return ReportUtils.getNormalizedNote({ note: this.getNote() });
  }
}
