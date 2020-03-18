import * as chromeLauncher from 'chrome-launcher'
import LH from 'lighthouse'
import { mocked } from 'ts-jest/utils'

import { runAnalysis } from '../../src/api/Client'
import { Config } from '../../src/config/Config'


jest.mock('chrome-launcher')
jest.mock('lighthouse')
const mockedChromeLauncher = mocked(chromeLauncher, true)
const mockedLH = mocked(LH, true)

describe('Run an analysis', () => {

  const RESULTS = {
    lhr: {
      categories: {
        category1: { score: 67 },
        category2: { score: 74 },
        category3: { score: 95 },
        category4: { score: 88 },
        category5: { score: 53 },
      }
    }
  }

  it('should runs an analysis with a valid configuration', async () => {
    const CONF: Config = {
      url: 'https://www.examples.com/',
      config: {
        extends: 'lighthouse:default',
        settings: {
          onlyAudits: [
            'first-meaningful-paint',
            'speed-index',
            'first-cpu-idle',
            'interactive'
          ]
        }
      }
    }

    // mock chrome-launcher and lighthouse modules methods
    mockedChromeLauncher.launch.mockResolvedValue({
      pid: 1111,
      port: 1234,
      process: null,
      kill: () => Promise.resolve({})
    })
    mockedLH.mockResolvedValue(RESULTS)

    const results = await runAnalysis(CONF)
    expect(results).toStrictEqual(RESULTS)
  })
})
