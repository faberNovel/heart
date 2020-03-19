import AnalysisResponseInterface from '../../../src/api/model/AnalysisResponseInterface';
import ReportResponseInterface from '../../../src/api/model/ReportResponseInterface';

let analysisResponse: AnalysisResponseInterface = null;
let reportResponse: ReportResponseInterface = null;
const __setMockAnalysisResponse = (newResponse: AnalysisResponseInterface): void => {
  analysisResponse = newResponse;
};

const __setMockReportResponse = (newResponse: ReportResponseInterface): void => {
  reportResponse = newResponse;
};

class Client {
  constructor() {}

  public async launchAnalysis(conf: object): Promise<AnalysisResponseInterface> {
    return Promise.resolve(analysisResponse);
  }

  public async getAnalysisReport(reportId: string): Promise<ReportResponseInterface> {
    return Promise.resolve(reportResponse);
  }
}

export { __setMockAnalysisResponse, __setMockReportResponse };
export default Client;
