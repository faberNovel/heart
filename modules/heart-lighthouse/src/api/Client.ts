import * as chromeLauncher from 'chrome-launcher'
import LH from 'lighthouse'

import { Config } from '../config/Config'

export async function runAnalysis(conf: Config): Promise<LH.RunnerResult|undefined> {
  try {
    const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] })

    try {
      const results: LH.RunnerResult|undefined = await LH(conf.url, { port: chrome.port, output: 'json' }, conf.config)
      chrome.kill()
      return results
    } catch (error) {
      console.warn(`[LIGHTHOUSE] WARN  -`, 'An error occured while killing Chrome: ', JSON.stringify(error))
      return Promise.reject(error.message)
    }
  } catch (error) {}
}
