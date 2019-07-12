import { Helper, Module, ModuleAnalysisInterface, ModuleInterface, Report } from '@fabernovel/heart-core';

import { Status } from './api/enum/Status';
import Host from './api/model/Host';
import ApiClient from './api/Client';

export default class SsllabsServerModule extends Module implements ModuleAnalysisInterface {
  private static readonly MAX_TRIES = 100;
  private static readonly TIME_BETWEEN_TRIES = 10000; // 10 seconds
  private apiClient: ApiClient;

  constructor(module: Partial<ModuleInterface>) {
    super(module);

    this.apiClient = new ApiClient();
  }

  public async startAnalysis(conf: object): Promise<Report> {
    let host: Host;

    try {
      host = await this.apiClient.launchAnalysis(conf);
    } catch (error) {
      return Promise.reject(error);
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

  private async requestReport(triesQty: number = 1): Promise<Report> {
    if (triesQty > SsllabsServerModule.MAX_TRIES) {
      throw new Error(`The maximum number of tries (${SsllabsServerModule.MAX_TRIES}) to retrieve the report has been reached.`);
    }

    try {
      const host = await this.apiClient.getAnalysisReport();

      return this.handleRequestScan(host, triesQty);
    } catch (error) {
      return Promise.reject({
        error: 'error',
        message: error.message
      });
    }
  }

  private async handleRequestScan(host: Host, triesQty: number): Promise<Report> {
    switch (host.status) {
      case Status.ERROR:
        throw new Error(`${host.status}: ${host.statusMessage}`);

      case Status.DNS:
      case Status.IN_PROGRESS:
        await Helper.timeout(SsllabsServerModule.TIME_BETWEEN_TRIES);
        return this.requestReport(++triesQty);

      case Status.READY:
        const averageRating = host.getAveragePercentage();

        return new Report({
          analyzedUrl: this.apiClient.getProjectUrl(),
          note: averageRating.toString(),
          normalizedNote: averageRating,
          resultUrl: this.apiClient.getAnalyzeUrl(),
          date: new Date(host.startTime),
          service: this.service,
        });

      default:
        throw new Error(host.statusMessage);
    }
  }
}
