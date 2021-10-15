import { Request } from '@fabernovel/heart-core';

import Scan from './model/Scan.js';
import TestsResult from './model/TestsResult.js';

export default class Client {
  private analyzeUrl: string;
  private apiUrl: string;
  private host: string;

  constructor() {
    this.analyzeUrl = process.env.OBSERVATORY_ANALYZE_URL;
    this.apiUrl = process.env.OBSERVATORY_API_URL;
  }

  public launchAnalysis(conf: object): Promise<Scan> {
    this.host = conf['host'];

    if (undefined === this.host) {
      return Promise.reject({
        error: 'mandatory-parameter',
        message: '"host" is a mandatory parameter'
      });
    }

    return Request.post(this.apiAnalyzeUrl(), conf, {
      [Request.HEADER_CONTENT_TYPE]: Request.HEADER_CONTENT_TYPE_X_WWW_FORM_URLENCODED
    });
  }

  public retrieveResults(finishedScan: Scan): Promise<TestsResult> {
    return Request.get(this.apiGetScanResultsUrl(finishedScan.scan_id));
  }

  public getProjectHost(): string {
    return this.host;
  }

  public getAnalyzeUrl(): string {
    return this.analyzeUrl + this.getProjectHost();
  }

  public async getAnalysisReport(): Promise<Scan> {
    return Request.get(this.apiAnalyzeUrl());
  }

  private apiAnalyzeUrl(): string {
    return `${this.apiUrl}analyze?host=${this.getProjectHost()}`;
  }

  private apiGetScanResultsUrl(scanId: number): string {
    return `${this.apiUrl}getScanResults?scan=${scanId}`;
  }
}
