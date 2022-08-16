import { Report, ThresholdInputObject } from '@fabernovel/heart-core';

import DareboostModule from '../src/DareboostModule';

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
    const expectedReport = new Report({
      analyzedUrl: Conf.url,
      date: new Date(ApiReportResponse.report.date),
      note: ApiReportResponse.report.summary.score.toString(),
      resultUrl: ApiReportResponse.report.publicReportUrl,
      service: {
        name: 'Dareboost Test'
      }
    });


    const report = await module.startAnalysis(Conf);

    expect(report).toEqual(expectedReport);
  });

  it('should starts an analysis with an invalid configuration', async () => {
    try {
      await module.startAnalysis({});
    } catch (e) {
      expect(e).toHaveProperty('error');
    }
  });

  it('Should start an analysis with a multi-variable thresholds object', async () => {

    const thresholds: ThresholdInputObject = {
      normalizedNote: {
        gte: 90,
        eq: 95
      }
    };

    const report = await module.startAnalysis(Conf, thresholds);

    const expectedReport = new Report({
      analyzedUrl: Conf.url,
      date: new Date(ApiReportResponse.report.date),
      note: ApiReportResponse.report.summary.score.toString(),
      resultUrl: ApiReportResponse.report.publicReportUrl,
      normalizedNote: ApiReportResponse.report.summary.score,
      thresholds,
      service: {
        name: 'Dareboost Test'
      },
    });

    expect(report).toStrictEqual(expectedReport);
  });

  it('Should start an analysis with an empty thresholds', async () => {

    const thresholds: ThresholdInputObject = {};

    const report = await module.startAnalysis(Conf, thresholds);

    const expectedReport = new Report({
      analyzedUrl: Conf.url,
      date: new Date(ApiReportResponse.report.date),
      note: ApiReportResponse.report.summary.score.toString(),
      resultUrl: ApiReportResponse.report.publicReportUrl,
      normalizedNote: ApiReportResponse.report.summary.score,
      thresholds,
      service: {
        name: 'Dareboost Test'
      },
    });

    expect(report).toStrictEqual(expectedReport);
    expect(report).toHaveProperty('thresholds', {});
    expect(report).not.toHaveProperty('areThresholdsReached');
    expect(report).not.toHaveProperty('thresholdsResults');
  });

  it('Should return false status when results do not match thresholds objectives', async () => {

    const thresholds: ThresholdInputObject = {
      normalizedNote: {
        gte: 98,
        lte: 98
      }
    };

    const report = await module.startAnalysis(Conf, thresholds);

    const expectedReport = new Report({
      analyzedUrl: Conf.url,
      date: new Date(ApiReportResponse.report.date),
      note: ApiReportResponse.report.summary.score.toString(),
      resultUrl: ApiReportResponse.report.publicReportUrl,
      normalizedNote: ApiReportResponse.report.summary.score,
      thresholds,
      service: {
        name: 'Dareboost Test'
      },
    });

    expect(report).toStrictEqual(expectedReport);
    expect(report).toHaveProperty('areThresholdsReached');
    expect(report).toHaveProperty('thresholdsResults');
    expect(report.areThresholdsReached).toStrictEqual(false);
    expect(report.thresholdsResults?.normalizedNote?.gte?.result).toStrictEqual(false);
    expect(report.thresholdsResults?.normalizedNote?.lte?.result).toStrictEqual(true);
  });
});
