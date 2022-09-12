import { readFileSync } from 'fs';
import { createJsonReports, Options } from 'greenit-cli/cli-core/analysis';
import puppeteer from 'puppeteer';

import { GreenITConfig } from '../config/Config';
import { Result } from './model/Result';

const DEFAULT_OPTIONS: Options = {
  device: 'desktop',
  max_tab: 3,
  retry: 2,
  timeout: 3000,
};

export async function runAnalysis(conf: GreenITConfig): Promise<Result> {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox', // can't run inside docker without
      '--disable-setuid-sandbox', // but security issues
    ],
    // Keep gpu horsepower in headless
    ignoreDefaultArgs: ['--disable-gpu'],
  });

  const options: Options = {
    device: conf.device ?? DEFAULT_OPTIONS.device,
    max_tab: DEFAULT_OPTIONS.max_tab,
    retry: conf.retry ?? DEFAULT_OPTIONS.retry,
    timeout: conf.timeout ?? DEFAULT_OPTIONS.timeout,
   }

  try {
    const reports = await createJsonReports(browser, [{ url: conf.url }], options);

    if (0 === reports.length) {
      throw new Error('No report has been generated')
    }

    return JSON.parse(readFileSync(reports[0].path, { encoding: 'utf-8' })) as Result
  } catch (error) {
    return Promise.reject(error);
  } finally {
    const pages = await browser.pages();
    await Promise.all(pages.map((_) => _.close()));
    await browser.close();
  }
}
