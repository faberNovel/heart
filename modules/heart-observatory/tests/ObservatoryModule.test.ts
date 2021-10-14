import Scan from '../src/api/model/Scan';
import ObservatoryModule from '../src/ObservatoryModule';
import ObservatoryReport from '../src/api/model/ObservatoryReport';


jest.mock('@fabernovel/heart-core');

describe('Starts an analysis', () => {
  const ANALYZE_URL = 'www.observatory.mozilla-test/results';
  const API_URL = 'www.observatory.mozilla-test/api';
  const SCAN: Scan = {
    end_time: '2021-10-14',
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

  beforeEach(() => {
    process.env.OBSERVATORY_ANALYZE_URL = ANALYZE_URL;
    process.env.OBSERVATORY_API_URL = API_URL;
    require('@fabernovel/heart-core').__setMockScan(SCAN);
  });

  test('Starts an analysis with a valid configuration', async () => {
    const module = new ObservatoryModule({
      name: 'Heart Observatory Test',
      service: {
        name: 'Observatory Test'
      },
    });

    const REPORT = new ObservatoryReport({
      analyzedUrl: 'www.website.test',
      date: new Date('2021-10-14'),
      resultUrl: ANALYZE_URL + 'www.website.test',
      service: {
        name: 'Observatory Test'
      },
      value: SCAN
    });

    const report = await module.startAnalysis({ host: 'www.website.test' });

    expect(report).toStrictEqual(REPORT);
  });

  test('Starts an analysis with an invalid configuration', async () => {
    const module = new ObservatoryModule({
      name: 'Heart Observatory Test'
    });

    try {
      await module.startAnalysis({});
    } catch (e) {
      expect(e).toHaveProperty('error');
    }
  });
});

