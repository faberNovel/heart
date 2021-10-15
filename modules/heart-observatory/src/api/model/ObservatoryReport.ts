import { GenericReport, ReportArguments, ServiceInterface } from '@fabernovel/heart-core';

import Scan from './Scan';
import TestsResult from './TestsResult';

interface ObservatoryReportType {
  scan: Scan;
  testsResult: TestsResult;
}

export default class ObservatoryReport implements GenericReport<ObservatoryReportType> {
  analyzedUrl: string;
  date: Date;
  resultUrl?: string;
  service: ServiceInterface;
  value: ObservatoryReportType;

  constructor(report: ReportArguments<ObservatoryReportType>) {
    Object.assign(this, report);
  }

  get note() {
    return this.getNote();
  }

  get normalizedNote() {
    return this.getNormalizedNote();
  }

  getNote() {
    return this.value.grade;
  }

  getNormalizedNote() {
    return this.value.score > 100 ? 100 : this.value.score;
  }
}
