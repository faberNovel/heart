import { Helper, Module, ModuleAnalysisInterface, ModuleInterface } from '@fabernovel/heart-core';

import ObservatoryReport from './api/model/ObservatoryReport';
import Scan from './api/model/Scan';
import ApiClient from './api/Client';

export default class ObservatoryModule extends Module implements ModuleAnalysisInterface {
  private readonly TIME_BETWEEN_TRIES = 10000;
  private apiClient: ApiClient;

  constructor(module: Partial<ModuleInterface>) {
    super(module);

    this.apiClient = new ApiClient();
  }

  public async startAnalysis(conf: object): Promise<ObservatoryReport> {
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

  private async requestScan(): Promise<ObservatoryReport> {
    let scan: Scan;

    try {
      scan = await this.apiClient.getAnalysisReport();
    } catch (error) {
      return Promise.reject({
        error: 'error',
        message: error.message
      });
    }

    console.log('getAnalysisReport =', scan)

    return this.handleRequestScan(scan);
  }

  private async handleRequestScan(scan: Scan): Promise<ObservatoryReport> {
    switch (scan.state) {
      case 'FAILED':
        throw new Error(scan.state);
        break;

      case 'FINISHED':
        return new ObservatoryReport({
          analyzedUrl: this.apiClient.getProjectHost(),
          resultUrl: this.apiClient.getAnalyzeUrl(),
          service: this.service,
          date: new Date(scan.end_time),
          value: scan
        });
        break;

      default:
        await Helper.timeout(this.TIME_BETWEEN_TRIES);
        return this.requestScan();
        break;
    }
  }
}
