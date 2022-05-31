import { Helper, Module, ModuleAnalysisInterface, ModuleInterface, Report } from '@fabernovel/heart-core';

import Scan from './api/model/Scan';
import ApiClient from './api/Client';

export default class ObservatoryModule extends Module implements ModuleAnalysisInterface {
  private readonly TIME_BETWEEN_TRIES = 10000;
  private apiClient: ApiClient;

  constructor(module: Partial<ModuleInterface>) {
    super(module);

    this.apiClient = new ApiClient();
  }

  public async startAnalysis(conf: object): Promise<Report> {
    await this.apiClient.launchAnalysis(conf);

    return this.requestScan();
  }

  private async requestScan(): Promise<Report> {
    let scan: Scan;

    try {
      scan = await this.apiClient.getAnalysisReport();
    } catch (error) {
      return Promise.reject({
        error: 'error',
        message: error.message
      });
    }

    return this.handleRequestScan(scan);
  }

  private async handleRequestScan(scan: Scan): Promise<Report> {
    switch (scan.state) {
      case 'FAILED':
        throw new Error(scan.state);
        break;

      case 'FINISHED':
        return new Report({
          analyzedUrl: this.apiClient.getProjectHost(),
          note: scan.grade,
          resultUrl: this.apiClient.getAnalyzeUrl(),
          service: this.service,
          date: new Date(scan.end_time),
          normalizedNote: scan.score > 100 ? 100 : scan.score
        });
        break;

      default:
        await Helper.timeout(this.TIME_BETWEEN_TRIES);
        return this.requestScan();
        break;
    }
  }
}
