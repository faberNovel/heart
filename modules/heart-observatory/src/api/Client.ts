import { Request } from '@fabernovel/heart-core';

import Scan from './model/Scan.js';

export default class Client {
  private analyzeUrl: string;
  private apiUrl: string;
  private host: string;

  constructor() {
    this.analyzeUrl = process.env.OBSERVATORY_ANALYZE_URL;
    this.apiUrl = process.env.OBSERVATORY_API_URL;
  }

  public async launchAnalysis(conf: any): Promise<Scan> {
    /** @deprecated conf['project_url'] use conf['host'] */
    this.host = conf['host'] || conf['project_url'];
    if (undefined === this.host) {
      return Promise.reject({
        error: 'mandatory-parameter',
        message: '"host" is a mandatory parameter'
      });
    }

    // Remove unused properties for POST parameters
    delete conf.host;
    delete conf.project_url;

    return Request.post(this.generateApiUrl('analyze'), conf, {
      [Request.HEADER_CONTENT_TYPE]: Request.HEADER_CONTENT_TYPE_X_WWW_FORM_URLENCODED
    });
  }

  public getProjectHost(): string {
    return this.host;
  }

  public getAnalyzeUrl(): string {
    return this.analyzeUrl + this.getProjectHost();
  }

  public async getAnalysisReport(): Promise<Scan> {
    return Request.get(this.generateApiUrl('analyze'));
  }

  private generateApiUrl(path: string): string {
    return `${this.apiUrl}${path}?host=${this.getProjectHost()}`;
  }
}
