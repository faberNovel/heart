import { createJsonReports, Options, Report } from 'greenit-cli/cli-core/analysis';
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
    const results: Report[] = await createJsonReports(browser, [{ url: conf.url }], options);

    const firstResult: Result = await import(results[0].path);
    return firstResult;
  } catch (error) {
    return Promise.reject(error);
  } finally {
    const pages = await browser.pages();
    await Promise.all(pages.map((_) => _.close()));
    await browser.close();
  }
}
