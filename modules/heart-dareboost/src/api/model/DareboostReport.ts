import { GenericReport, ReportArguments, ReportUtils, ServiceInterface } from '@fabernovel/heart-core';

import ReportResponseInterface from './ReportResponseInterface';

type DareboostReportType = ReportResponseInterface;

export default class DareboostReport implements GenericReport<DareboostReportType> {
  analyzedUrl: string;
  date: Date;
  resultUrl?: string;
  service: ServiceInterface;
  value: DareboostReportType;

  constructor(report: ReportArguments<DareboostReportType>) {
    Object.assign(this, report);
  }

  get note() {
    return this.getNote();
  }

  get normalizedNote() {
    return this.getNormalizedNote();
  }

  getNote() {
    return this.value.report.summary.score.toString();
  }

  getNormalizedNote() {
    return ReportUtils.getNormalizedNote({ note: this.getNote() });
  }
}
