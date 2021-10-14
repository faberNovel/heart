import ServiceInterface from '../service/ServiceInterface';

import ReportInterface from './ReportInterface';

type ReportInterfaceWithoutMethods = Omit<ReportInterface, 'prettyString'>;
export type ReportArguments = Partial<ReportInterfaceWithoutMethods>;

/**
 * Define an analysis report that is shared between every Heart module.
 *
 * /!\ WARNING /!\
 * Be very careful if you change the Report class structure, as it could have an impact on every Heart module.
 */
export default class Report implements ReportInterfaceWithoutMethods {
  analyzedUrl: string;
  date: Date;
  note: string;
  normalizedNote: number;
  resultUrl?: string;
  service: ServiceInterface;

  constructor(report: ReportArguments) {
    Object.assign(this, report);

    this.normalizedNote = report.normalizedNote ?? parseInt(report.note, 10) ?? 0;
  }
}
