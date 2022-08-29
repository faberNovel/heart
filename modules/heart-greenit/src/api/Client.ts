import { createJsonReports, Options } from 'greenit-cli/cli-core/analysis';
import puppeteer from 'puppeteer';

import { GreenITConfig } from '../config/Config';
import { Result } from './model/Result';

export async function runAnalysis(conf: GreenITConfig): Promise<Result> {
  const DEFAULT_OPTIONS: Options = {
    max_tab: 3,
    timeout: 3000,
    retry: 2,
  };

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
    timeout: conf.timeout ?? DEFAULT_OPTIONS.timeout,
    retry: conf.retry ?? DEFAULT_OPTIONS.retry,
    device: conf.device ?? DEFAULT_OPTIONS.device,
   }


  try {
    const reports = await createJsonReports(browser, [{ url: conf.url }], options);

    if (0 === reports.length) {
      throw new Error('No report has been generated')
    }

    return import(reports[0].path) as Promise<Result>
  } catch (error) {
    return Promise.reject(error);
  } finally {
    const pages = await browser.pages();
    await Promise.all(pages.map((_) => _.close()));
    await browser.close();
  }
}
