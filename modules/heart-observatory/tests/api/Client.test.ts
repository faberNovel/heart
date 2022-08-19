import {ScanInterface} from '../../src/api/model/Scan';
import {Client} from '../../src/api/Client';
import { Request } from '@fabernovel/heart-core'
import { ObservatoryConfig } from '../../src/config/Config';

jest.mock('@fabernovel/heart-core');
const mockedRequest = jest.mocked(Request);

describe('Client', () => {
  const ANALYZE_URL = 'www.observatory.mozilla/results';
  const API_URL = 'www.observatory.mozilla/api';
  const SCAN: ScanInterface = {
    end_time: '',
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
    mockedRequest.get.mockResolvedValue(SCAN)
    mockedRequest.post.mockResolvedValue(SCAN)
  });

  test('Analyze with valid configuration', async () => {
    const CONF = { host: 'www.website.test' };

    const client = new Client();

    const scan = await client.launchAnalysis(CONF);

    expect(scan).toStrictEqual(SCAN);
    expect(client.getProjectHost()).toBe(CONF.host);
    expect(client.getAnalyzeUrl()).toBe(ANALYZE_URL + CONF.host);
  });

  test('Analyze with invalid configuration', async () => {
    const CONF = {} as ObservatoryConfig;

    const client = new Client();

    try {
      await client.launchAnalysis(CONF);
    } catch (e) {
      expect(e).toHaveProperty('error');
    }
  });
});
