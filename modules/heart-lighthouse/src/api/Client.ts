import * as chromeLauncher from 'chrome-launcher'
import lighthouse from 'lighthouse'

import { Config } from '../config/Config'

export async function runAnalysis(conf: Config): Promise<any> {
  try {
    const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless', '--no-sandbox'] })

    const results = await lighthouse(conf.url, { port: chrome.port, output: 'json' }, conf.config)

    await chrome.kill()

    return results
  } catch (error) {
    return Promise.reject(error)
  }
}
