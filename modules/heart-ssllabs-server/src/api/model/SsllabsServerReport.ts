import { ReportInterface, ServiceInterface } from '@fabernovel/heart-core';

export type SsllabsServerReportType = unknown; // TODO: real report type

export default class SsllabsServerReport implements ReportInterface<SsllabsServerReportType> {
  analyzedUrl: string;
  date: Date;
  resultUrl?: string;
  service: ServiceInterface;
  value: SsllabsServerReportType;

  constructor(report: ReportInterface<SsllabsServerReportType>) {
    Object.assign(this, report);
  }
}
