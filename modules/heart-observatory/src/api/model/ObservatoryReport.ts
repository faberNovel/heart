import { GenericReport, ReportArguments, ServiceInterface } from '@fabernovel/heart-core';

import Scan from './Scan';

type ObservatoryReportType = Scan;

export default class ObservatoryReport implements GenericReport<ObservatoryReportType> {
  analyzedUrl: string;
  date: Date;
  resultUrl?: string;
  service: ServiceInterface;
  value: ObservatoryReportType;

  constructor(report: ReportArguments<ObservatoryReportType>) {
    Object.assign(this, report);
  }

  getNote() {
    return this.value.grade;
  }

  getNormalizedNote() {
    return this.value.score > 100 ? 100 : this.value.score;
  }
}
