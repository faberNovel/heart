import { AnalysisInterface, Helper, Report } from '@fabernovel/heart-core';

import { Status } from './api/enum/Status';
import Host from './api/model/Host';
import ApiClient from './api/Client';

export default class Analysis implements AnalysisInterface {
  private static readonly MAX_TRIES = 100;
  private static readonly TIME_BETWEEN_TRIES = 10000; // 10 seconds
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = new ApiClient();
  }

  public async start(conf: any): Promise<Report> {
    let host: Host;

    try {
      host = await this.apiClient.launchAnalysis(conf);
    } catch (err) {
      return Promise.reject(err);
    }

    if (host.hasOwnProperty('error')) {
      return Promise.reject({
        error: host['error'],
        message: host['text']
      });
    }

    if (host.status === Status.ERROR) {
      return Promise.reject({
        error: 'error',
        message: host.statusMessage
      });
    }

    return this.requestReport();
  }

  public getRoutePath(): string {
    return '/ssllabs-server';
  }

  private async requestReport(triesQty: number = 1): Promise<Report> {
    if (triesQty > Analysis.MAX_TRIES) {
      throw new Error(`The maximum number of tries (${Analysis.MAX_TRIES}) to retrieve the report has been reached.`);
    }

    try {
      const host = await this.apiClient.getAnalysisReport();

      return this.handleRequestScan(host, triesQty);
    } catch (err) {
      return Promise.reject({
        error: 'error',
        message: err.message
      });
    }
  }

  private async handleRequestScan(host: Host, triesQty: number): Promise<Report> {
    switch (host.status) {
      case Status.ERROR:
        throw new Error(`${host.status}: ${host.statusMessage}`);

      case Status.DNS:
      case Status.IN_PROGRESS:
        await Helper.wait(Analysis.TIME_BETWEEN_TRIES);
        return this.requestReport(++triesQty);

      case Status.READY:
        const projectUrl = this.apiClient.getProjectUrl();
        const analyzeUrl = this.apiClient.getAnalyzeUrl();

        return new Report(projectUrl,
          host.getAveragePercentage().toString(),
          analyzeUrl,
          'SSL Labs',
          new Date(host.startTime)
        );

      default:
        throw new Error(host.statusMessage);
    }
  }
}
