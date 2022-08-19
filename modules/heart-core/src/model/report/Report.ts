import {ServiceInterface} from '../service/ServiceInterface';
import { validateAgainstThresholds } from '../threshold/validateAgainstThresholds';
import { ThresholdInputObject, ThresholdOutputObject } from '../threshold/ReportThresholdObject';

import {ReportInterface} from './ReportInterface';

/**
 * Define an analysis report that is shared between every Heart module.
 *
 * /!\ WARNING /!\
 * Be very careful if you change the Report class structure, as it could have an impact on every Heart module.
 */
export class Report implements ReportInterface {
  analyzedUrl: string;
  date: Date;
  note: string;
  normalizedNote: number;
  resultUrl?: string;
  service: ServiceInterface;

  thresholds?: ThresholdInputObject;
  thresholdsResults?: ThresholdOutputObject;
  areThresholdsReached?: boolean;

  constructor(report: Partial<ReportInterface>) {
    Object.assign(this, report);

    this.normalizedNote = this.normalizedNote || parseInt(this.note, 10) || 0;

    if (this.thresholds && Object.keys(this.thresholds).length > 0) {
      const { status, results } = validateAgainstThresholds(this);

      this.areThresholdsReached = status;
      this.thresholdsResults = results;
    }
  }

}

