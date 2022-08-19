import {
  Helper,
  Module,
  ModuleAnalysisInterface,
  ModuleInterface,
  Report,
  ThresholdInputObject,
} from '@fabernovel/heart-core';

import {ScanInterface} from './api/model/Scan';
import {Client} from './api/Client';

export class ObservatoryModule
  extends Module
  implements ModuleAnalysisInterface {
  private readonly TIME_BETWEEN_TRIES = 10000;

  private apiClient: Client;
  private thresholds: ThresholdInputObject;

  constructor(module: Partial<ModuleInterface>) {
    super(module);

    this.apiClient = new Client();
  }

  public async startAnalysis(
    conf: object,
    thresholds?: ThresholdInputObject
  ): Promise<Report> {
    this.thresholds = thresholds;

    try {
      await this.apiClient.launchAnalysis(conf);
    } catch (error) {
      return Promise.reject({
        error: 'error',
        message: error.message
      });
    }

    return this.requestScan();
  }

  private async requestScan(): Promise<Report> {

    try {
      const scan = await this.apiClient.getAnalysisReport();

      return this.handleRequestScan(scan);
    } catch (error) {
      return Promise.reject({
        error: 'error',
        message: error.message
      });
    }
  }

  private async handleRequestScan(scan: ScanInterface): Promise<Report> {
    switch (scan.state) {
      case 'FAILED':
        throw new Error(scan.state);
        break;

      case 'PENDING':
      case 'STARTING':
      case 'RUNNING':
        await Helper.timeout(this.TIME_BETWEEN_TRIES);
        return this.requestScan();
        break;

      case 'FINISHED':
        return new Report({
          analyzedUrl: this.apiClient.getProjectHost(),
          note: scan.grade,
          resultUrl: this.apiClient.getAnalyzeUrl(),
          service: this.service,
          date: new Date(scan.end_time),
          normalizedNote: scan.score > 100 ? 100 : scan.score,
          thresholds: this.thresholds,
        });
        break;

      default:
        throw new Error(scan.state);
    }
  }
}
