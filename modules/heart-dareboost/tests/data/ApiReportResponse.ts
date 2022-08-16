import ReportResponseInterface from '../../src/api/model/ReportResponseInterface';

export const ApiReportResponse: ReportResponseInterface = {
  status: 200,
  message: '',
  missing: [],
  report: {
    publicReportUrl: '',
    harFileUrl: '',
    date: 1584540399,
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
        height: 0,
        width: 0
      },
      basicAuth: {
        user: '',
        password: '',
      },
      postData: [
        {
          key: '',
          value: '',
        }
      ],
      header: [
        {
          key: '',
          value: '',
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
      score: 95,
      requestsCount: 0,
      weight: 0,
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
