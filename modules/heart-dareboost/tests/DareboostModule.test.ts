import DareboostModule from '../src/DareboostModule';
import DareboostReport from '../src/api/model/DareboostReport';

import { ApiAnalysisResponse } from './data/ApiAnalysisResponse';
import { ApiReportResponse } from './data/ApiReportResponse';
import { Conf } from './data/Conf';


const mockLaunchAnalysis = jest.fn().mockResolvedValue(ApiAnalysisResponse);
const mockGetAnalysisReport = jest.fn().mockResolvedValue(ApiReportResponse);
jest.mock('../src/api/Client', () => {
  return jest.fn().mockImplementation(() => {
    return {
      launchAnalysis: mockLaunchAnalysis,
      getAnalysisReport: mockGetAnalysisReport,
    };
  });
});

describe('Starts an analysis', () => {
  let module: DareboostModule;

  beforeEach(() => {
    module = new DareboostModule({
      name: 'Heart Dareboost Test',
      service: {
        name: 'Dareboost Test'
      },
    });
  });

  it('should starts an analysis with a valid configuration', async () => {
    const REPORT = new DareboostReport({
      analyzedUrl: Conf.url,
      date: new Date(ApiReportResponse.report.date),
      resultUrl: ApiReportResponse.report.publicReportUrl,
      service: {
        name: 'Dareboost Test'
      },
      value: ApiReportResponse
    });

    const report = await module.startAnalysis(Conf);

    expect(report).toStrictEqual(REPORT);
  });

  it('should starts an analysis with an invalid configuration', async () => {
    try {
      await module.startAnalysis({});
    } catch (e) {
      expect(e).toHaveProperty('error');
    }
  });
});
