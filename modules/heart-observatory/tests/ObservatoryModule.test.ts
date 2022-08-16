jest.mock('@fabernovel/heart-core');

import { Report, ThresholdInputObject } from '@fabernovel/heart-core';

import Scan from '../src/api/model/Scan';
import ObservatoryModule from '../src/ObservatoryModule';

describe('Starts an analysis', () => {

  let module: ObservatoryModule;
  let SCAN: Scan;
  let report: Report;
  let expectedReport: Report;

  const ANALYZE_URL = 'www.observatory.mozilla-test/results/';
  const API_URL = 'www.observatory.mozilla-test/api/';

  beforeEach(() => {
    SCAN = {
      end_time: 'May 13, 2022 5:58 PM',
      grade: 'B',
      hidden: true,
      response_headers: {},
      scan_id: 1,
      score: 95,
      likelihood_indicator: '',
      start_time: '',
      state: 'FINISHED',
      tests_failed: 3,
      tests_passed: 4,
      tests_quantity: 12
    };

    process.env.OBSERVATORY_ANALYZE_URL = ANALYZE_URL;
    process.env.OBSERVATORY_API_URL = API_URL;

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('@fabernovel/heart-core').__setMockScan(SCAN);

    module = new ObservatoryModule({
      name: 'Heart Observatory Test',
      service: {
        name: 'Observatory Test'
      },
    });

  });

  it('Should start an analysis with a valid configuration without a threshold', async () => {

    report = await module.startAnalysis({ host: 'www.heart.fabernovel.com' });

    expectedReport = new Report({
      analyzedUrl: 'www.heart.fabernovel.com',
      date: report.date,
      note: SCAN.grade,
      resultUrl: ANALYZE_URL + 'www.heart.fabernovel.com',
      normalizedNote: SCAN.score > 100 ? 100 : SCAN.score,
      service: {
        name: 'Observatory Test'
      }
    });

    expect(report).toEqual(expectedReport);
  });

  it('Should throw an error with an invalid configuration', async () => {

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
      },
    };

    report = await module.startAnalysis({ host: 'www.heart.fabernovel.com' }, thresholds);

    expectedReport = new Report({
      analyzedUrl: 'www.heart.fabernovel.com',
      date: report.date,
      note: SCAN.grade,
      resultUrl: ANALYZE_URL + 'www.heart.fabernovel.com',
      normalizedNote: SCAN.score > 100 ? 100 : SCAN.score,
      thresholds,
      service: {
        name: 'Observatory Test'
      },
    });

    expect(report).toStrictEqual(expectedReport);
  });

  it('Should start an analysis with an empty thresholds', async () => {

    const thresholds: ThresholdInputObject = {};

    report = await module.startAnalysis({ host: 'www.heart.fabernovel.com' }, thresholds);

    expectedReport = new Report({
      analyzedUrl: 'www.heart.fabernovel.com',
      date: report.date,
      note: SCAN.grade,
      resultUrl: ANALYZE_URL + 'www.heart.fabernovel.com',
      normalizedNote: SCAN.score > 100 ? 100 : SCAN.score,
      thresholds,
      service: {
        name: 'Observatory Test'
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
      },
    };

    report = await module.startAnalysis({ host: 'www.heart.fabernovel.com' }, thresholds);

    expectedReport = new Report({
      analyzedUrl: 'www.heart.fabernovel.com',
      date: report.date,
      note: SCAN.grade,
      resultUrl: ANALYZE_URL + 'www.heart.fabernovel.com',
      normalizedNote: SCAN.score > 100 ? 100 : SCAN.score,
      thresholds,
      service: {
        name: 'Observatory Test'
      },
    });

    expect(report).toStrictEqual(expectedReport);
    expect(report).toHaveProperty('areThresholdsReached');
    expect(report).toHaveProperty('thresholdsResults');
    expect(report.areThresholdsReached).toEqual(false);
    expect(report.thresholdsResults?.normalizedNote?.gte?.result).toStrictEqual(false);
    expect(report.thresholdsResults?.normalizedNote?.lte?.result).toStrictEqual(true);
  });
});

