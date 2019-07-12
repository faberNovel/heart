import { Request } from '@fabernovel/heart-core';

import AnalysisResponseInterface from './model/AnalysisResponseInterface';
import ReportResponseInterface from './model/ReportResponseInterface';

export default class Client {
  private readonly API_URL = 'https://www.dareboost.com/api/0.5/';
  private conf: object;

  constructor() {
    this.conf = { token: process.env.DAREBOOST_API_TOKEN };
  }

  public async launchAnalysis(conf: object): Promise<AnalysisResponseInterface> {
    const options = {...conf, headers: [{name: 'User-Agent', value: 'Dareboost'}]};

    return Request.post(`${this.API_URL}analysis/launch`, { ...this.conf, ...options });
  }

  public async getAnalysisReport(reportId: string): Promise<ReportResponseInterface> {
    return Request.post(`${this.API_URL}analysis/report`, { ...this.conf, reportId });
  }
}
