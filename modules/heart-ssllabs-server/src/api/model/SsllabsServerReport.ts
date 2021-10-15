import { ReportArguments, ReportInterface, ServiceInterface } from '@fabernovel/heart-core';

import Host from './Host';

export type SsllabsServerReportType = Host;

export default class SsllabsServerReport implements ReportInterface<SsllabsServerReportType> {
  analyzedUrl: string;
  date: Date;
  resultUrl?: string;
  service: ServiceInterface;
  value: SsllabsServerReportType;

  constructor(report: ReportArguments<SsllabsServerReportType>) {
    Object.assign(this, report);
  }

  getNote() {
    return this.getNormalizedNote.toString();
  }

  getNormalizedNote() {
    return this.value.getAveragePercentage();
  }
}
