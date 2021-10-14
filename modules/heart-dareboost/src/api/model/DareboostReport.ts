import { ReportInterface, ServiceInterface } from '@fabernovel/heart-core';

export type DareboostReportType = unknown; // TODO: real report type

export default class DareboostReport implements ReportInterface<DareboostReportType> {
  analyzedUrl: string;
  date: Date;
  resultUrl?: string;
  service: ServiceInterface;
  value: DareboostReportType;

  constructor(report: ReportInterface<DareboostReportType>) {
    Object.assign(this, report);
  }
}
