import { Request } from '@fabernovel/heart-core';
import { mocked } from 'jest-mock';

import AnalysisResponseInterface from '../../src/api/model/AnalysisResponseInterface';
import ReportResponseInterface from '../../src/api/model/ReportResponseInterface';
import Client from '../../src/api/Client';


jest.mock('@fabernovel/heart-core');
const mockedRequest = mocked(Request, true);

describe('Launch analysis', () => {
  const ANALYSIS: AnalysisResponseInterface = {
    status: '',
    message: '',
    reportId: ''
  };

  it('should launch an analysis', async () => {
    const CONF = { url: 'www.website.test' };
    mockedRequest.post.mockResolvedValue(ANALYSIS);

    const client = new Client();
    const scan = await client.launchAnalysis(CONF);

    expect(scan).toStrictEqual(ANALYSIS);
  });
});

describe('Get anaysis report', () => {
  const REPORT: ReportResponseInterface = {
    status: 0,
    message: '',
    missing: [],
    report: {
      publicReportUrl: '',
      harFileUrl: '',
      date: 0,
      url: '',
      lang: '',
      config: {
        location: '',
        browser: {
          name: '',
          version: ''
        },
        isMobile: true,
        bandwidth: {
          upstream: 0,
          downstream: 0
        },
        latency: 0,
        isPrivate: true,
        screen: {
          height: 800,
          width: 600
        },
        basicAuth: {
          user: '',
          password: ''
        },
        postData: [
          {
            key: '',
            value: ''
          }
        ],
        header: [
          {
            key: '',
            value: ''
          }
        ],
        blacklist: [],
        whiteList: [],
        dnsMapping: [
          {
            origin: '',
            destination: ''
          }
        ]
      },
      summary: {
        loadTime: 0,
        score: 0,
        requestsCount: 0,
        weight: 0
      },
      categories: [
        {
          name: '',
        }
      ],
      tips: [
        {
          advice: '',
          category: '',
          score: 0,
          name: '',
          priority: 0,
        }
      ],
      timings: {
        firstByte: 0,
        firstPaint: 0,
        domInteractive: 0,
        loadEvent: 0,
        startRender: 0,
        speedIndex: 0,
        visuallyComplete: 0,
        oldVisuallyComplete: 0,
      },
      resourceByType: [
        {
          type: '',
          bodyWeight: 0,
          headerWeight: 0,
          requestCount: 0,
        }
      ],
      technos: [
        {
          name: '',
          version: '',
        }
      ]
    }
  };

  it('should retrieve the analysis report', async () => {
    mockedRequest.post.mockResolvedValue(REPORT);

    const client = new Client();
    const report = await client.getAnalysisReport('');

    expect(report).toStrictEqual(REPORT);
  });
});
