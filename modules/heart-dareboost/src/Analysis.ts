import { AnalysisInterface, Helper, Report } from '@fabernovel/heart-core';

import ReportResponseInterface from './api/model/ReportResponseInterface';
import ApiClient from './api/Client';

export default class Analysis implements AnalysisInterface {
  private readonly MAX_TRIES = 500;
  private readonly TIME_BETWEEN_TRIES = 5000;

  private conf: any;
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = new ApiClient();
  }

  public async start(conf: any): Promise<Report> {
    this.conf = conf;

    try {
      const analysisResponse = await this.apiClient.launchAnalysis(this.conf);

      return this.requestReport(analysisResponse.reportId);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  public getRoutePath(): string {
    return '/dareboost';
  }

  private async requestReport(reportId: string, triesQty: number = 1): Promise<Report> {
    if (triesQty > this.MAX_TRIES) {
      throw new Error(`The maximum number of tries (${this.MAX_TRIES}) to retrieve the report has been reached.`);
    }

    try {
      const reportResponse = await this.apiClient.getAnalysisReport(reportId);

      return this.handleResponseStatus(reportResponse, reportId, triesQty);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  private async handleResponseStatus (reportResponse: ReportResponseInterface, reportId: string, triesQty: number): Promise<Report> {
    switch (reportResponse.status) {
      case 202:
        await Helper.wait(this.TIME_BETWEEN_TRIES);
        return this.requestReport(reportId, ++triesQty);

      case 200:
        return Promise.resolve(new Report(
          this.conf.url,
          reportResponse.report.summary.score.toString(),
          reportResponse.report.publicReportUrl,
          'Dareboost',
          new Date(reportResponse.report.date),
        ));

      default:
        throw new Error(reportResponse.message);
    }
  }
}
