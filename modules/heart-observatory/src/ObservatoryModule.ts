import { Helper, Module, ModuleAnalysisInterface, ModuleInterface, ReportInterface } from '@fabernovel/heart-core';

import Scan from './api/model/Scan';
import ObservatoryReport from './api/model/ObservatoryReport';
import ApiClient from './api/Client';

export default class ObservatoryModule extends Module implements ModuleAnalysisInterface {
  private readonly TIME_BETWEEN_TRIES = 10000;
  private apiClient: ApiClient;

  constructor(module: Partial<ModuleInterface>) {
    super(module);

    this.apiClient = new ApiClient();
  }

  public async startAnalysis(conf: object): Promise<ReportInterface> {
    let scan: Scan;

    try {
       scan = await this.apiClient.launchAnalysis(conf);
    } catch (error) {
      return Promise.reject(error);
    }

    // Observatory API is unconventional, and does not take advantage of http verbs :/
    if (scan.hasOwnProperty('error')) {
      return Promise.reject({
        error: scan['error'],
        message: scan['text']
      });
    }

    if ('FAILED' === scan.state || 'ABORTED' === scan.state) {
      return Promise.reject({
        error: 'error',
        message: scan.state
      });
    }

    return this.requestScan();
  }

  private async requestScan(): Promise<ReportInterface> {
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

  private async handleRequestScan(scan: Scan): Promise<ReportInterface> {
    switch (scan.state) {
      case 'FAILED':
        throw new Error(scan.state);
        break;

      case 'FINISHED':
        return new ObservatoryReport({
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
