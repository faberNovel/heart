import { createJsonReports, Options, Report } from 'greenit-cli/cli-core/analysis';
import puppeteer from 'puppeteer';

import { Config, PageInfos } from '../config/Config';
import { Result } from './model/Result';

export async function runAnalysis(conf: Config): Promise<Result> {
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

  const page: PageInfos = {
    ...(conf.url && { url: conf.url })
  };

  const options: Partial<Options> = {
    ...(conf.timeout && { timeout: conf.timeout }),
    ...(conf.retry && { retry: conf.retry }),
    ...(conf.device && { device: conf.device }),
  };

  try {
    const results: Report[] = await createJsonReports(browser, [page], { ...DEFAULT_OPTIONS, ...options });

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
