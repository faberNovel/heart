import type { GreenITConfig, GreenITReport } from "@fabernovel/heart-common"
import { createJsonReports, type Options, type Report } from "greenit-cli/cli-core/analysis.js"
import { readFileSync } from "node:fs"
import puppeteer from "puppeteer"

const DEFAULT_OPTIONS: Options = {
  device: "desktop",
  max_tab: 3,
  retry: 2,
  timeout: 3000,
}

/**
 * @see {@link https://github.com/GoogleChrome/lighthouse/blob/main/docs/puppeteer.md#option-2-launch-chrome-with-lighthousechrome-launcher-and-handoff-to-puppeteer}
 */
export async function requestResult(config: GreenITConfig): Promise<GreenITReport["result"]> {
  const browser = await puppeteer.launch({
    // https://www.howtogeek.com/devops/how-to-run-puppeteer-and-headless-chrome-in-a-docker-container/#using-puppeteer-in-docker
    args: ["--disable-gpu", "--disable-dev-shm-usage", "--disable-setuid-sandbox", "--no-sandbox"],
    defaultViewport: null,
    // https://developer.chrome.com/articles/new-headless/
    headless: "new",
  })

  const options: Options = {
    ci: true,
    device: config.device ?? DEFAULT_OPTIONS.device,
    max_tab: DEFAULT_OPTIONS.max_tab,
    retry: config.retry ?? DEFAULT_OPTIONS.retry,
    timeout: config.timeout ?? DEFAULT_OPTIONS.timeout,
  }

  const reports = new Array<Report>()

  // As the createJsonReports use console.* functions to display progress info and errors and do not send back these information,
  // we need to disable the console.* functions during this operation to properly handle the output
  const consoleLog = console.log
  const consoleError = console.error

  try {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    console.log = () => {}
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    console.error = () => {}

    const r = await createJsonReports(browser, [{ url: config.url }], options)

    reports.push(...r)
  } catch (error) {
    return Promise.reject(error)
  } finally {
    console.log = consoleLog
    console.error = consoleError
    const pages = await browser.pages()
    await Promise.all(pages.map((_) => _.close()))
    await browser.close()
  }

  if (0 === reports.length) {
    return Promise.reject("No report has been generated")
  } else {
    const result = JSON.parse(readFileSync(reports[0].path, { encoding: "utf-8" })) as GreenITReport["result"]

    return result.success
      ? result
      : Promise.reject("Error during GreenIT analysis. Increasing the timeout can be a solution")
  }
}
