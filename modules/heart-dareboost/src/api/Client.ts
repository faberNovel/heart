import { Request } from '@fabernovel/heart-core';

import AnalysisResponseInterface from './model/AnalysisResponseInterface.js';
import ReportResponseInterface from './model/ReportResponseInterface.js';

export default class Client {
  private readonly API_URL = 'https://www.dareboost.com/api/0.5/';
  private conf: any;

  constructor() {
    this.conf = { token: process.env.DAREBOOST_API_TOKEN };
  }

  public async launchAnalysis(conf: any): Promise<AnalysisResponseInterface> {
    const options = {...conf, headers: [{name: 'User-Agent', value: 'Dareboost'}]};

    return Request.post(`${this.API_URL}analysis/launch`, { ...this.conf, ...options });
  }

  public async getAnalysisReport(reportId: string): Promise<ReportResponseInterface> {
    return Request.post(`${this.API_URL}analysis/report`, { ...this.conf, reportId });
  }
}
