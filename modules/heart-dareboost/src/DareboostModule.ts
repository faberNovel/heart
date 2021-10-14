import { Helper, Module, ModuleAnalysisInterface, ModuleInterface, ReportInterface } from '@fabernovel/heart-core';

import ReportResponseInterface from './api/model/ReportResponseInterface';
import ApiClient from './api/Client';
import DareboostReport from './api/model/DareboostReport';

export default class DareboostModule extends Module implements ModuleAnalysisInterface {
  private readonly MAX_TRIES = 500;
  private readonly TIME_BETWEEN_TRIES = 5000;

  private conf: object;
  private apiClient: ApiClient;

  constructor(module: Partial<ModuleInterface>) {
    super(module);

    this.apiClient = new ApiClient();
  }

  public async startAnalysis(conf: object): Promise<ReportInterface> {
    this.conf = conf;

    try {
      const analysisResponse = await this.apiClient.launchAnalysis(this.conf);

      return this.requestReport(analysisResponse.reportId);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  private async requestReport(reportId: string, triesQty: number = 1): Promise<ReportInterface> {
    if (triesQty > this.MAX_TRIES) {
      throw new Error(`The maximum number of tries (${this.MAX_TRIES}) to retrieve the report has been reached.`);
    }

    try {
      const reportResponse = await this.apiClient.getAnalysisReport(reportId);

      return this.handleResponseStatus(reportResponse, reportId, triesQty);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  private async handleResponseStatus (reportResponse: ReportResponseInterface, reportId: string, triesQty: number): Promise<ReportInterface> {
    switch (reportResponse.status) {
      case 202:
        await Helper.timeout(this.TIME_BETWEEN_TRIES);
        return this.requestReport(reportId, ++triesQty);

      case 200:
        return new DareboostReport({
          analyzedUrl: this.conf['url'],
          date: new Date(reportResponse.report.date),
          service: this.service,
          resultUrl: reportResponse.report.publicReportUrl,
          note: reportResponse.report.summary.score.toString(),
        });

      default:
        throw new Error(reportResponse.message);
    }
  }
}
