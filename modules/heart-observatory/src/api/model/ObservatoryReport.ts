import { ReportInterface, ServiceInterface } from '@fabernovel/heart-core';

export type ObservatoryReportType = unknown; // TODO: real report type

export default class ObservatoryReport implements ReportInterface<ObservatoryReportType> {
  analyzedUrl: string;
  date: Date;
  resultUrl?: string;
  service: ServiceInterface;
  value: ObservatoryReportType;

  constructor(report: ReportInterface<ObservatoryReportType>) {
    Object.assign(this, report);
  }
}
