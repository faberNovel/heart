import { AnalysisInterface, Helper, Report } from '@fabernovel/heart-core';

import Scan from './api/model/Scan';
import ApiClient from './api/Client';

export default class Analysis implements AnalysisInterface {
  private readonly TIME_BETWEEN_TRIES = 10000;
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = new ApiClient();
  }

  public async start(conf: any): Promise<Report> {
    let scan: Scan;

    try {
       scan = await this.apiClient.launchAnalysis(conf);
    } catch (err) {
      return Promise.reject(err);
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

  public getRoutePath(): string {
    return '/observatory';
  }

  private async requestScan(): Promise<Report> {
    let scan: Scan;

    try {
      scan = await this.apiClient.getAnalysisReport();
    } catch (err) {
      return Promise.reject({
        error: 'error',
        message: err.message
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
        const projectUrl = this.apiClient.getProjectHost();
        const analyzeUrl = this.apiClient.getAnalyzeUrl();

        return Promise.resolve(new Report(
          projectUrl,
          scan.grade,
          analyzeUrl,
          'Observatory',
          new Date(scan.end_time),
          scan.score > 100 ? 100 : scan.score
        ));
        break;

      default:
        await Helper.wait(this.TIME_BETWEEN_TRIES);
        return this.requestScan();
        break;
    }
  }
}
