import { mocked } from 'jest-mock'
import { Result } from 'lighthouse'
import { runAnalysis } from '../src/api/Client'
import { LighthouseConfig } from '../src/config/Config'
import {LighthouseModule} from '../src/LighthouseModule'


jest.mock('../src/api/Client')
const mockedRunAnalysis = mocked(runAnalysis, true)

describe('Starts an analysis', () => {
  const URL = 'https://heart.fabernovel.com/'

  const RESULT = {
    categories: {
      category1: { score: 67 },
      category2: { score: 74 },
      category3: { score: 95 },
      category4: { score: 88 },
      category5: { score: 53 },
    },
    requestedUrl: URL,
  } as unknown as Result // avoid the declaration of a huuuuuge object


  it('should starts an analysis with a valid configuration', async () => {
    const module = new LighthouseModule({
      name: 'Heart Lighthouse Test',
      service: {
        name: 'Lighthouse Test'
      },
    })

    const CONF: LighthouseConfig = {
      url: URL,
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

    // mock the analysis stuff
    mockedRunAnalysis.mockResolvedValue(RESULT)

    const report = await module.startAnalysis(CONF)

    expect(report.analyzedUrl).toStrictEqual(CONF.url)
    expect(report).toHaveProperty('date')
    expect(report).toHaveProperty('note')
    expect(report).toHaveProperty('normalizedNote')
  })
})
