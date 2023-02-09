import { GreenITConfig, GreenITResult } from "@fabernovel/heart-core"
import { createJsonReports, Options, Report } from "greenit-cli/cli-core/analysis"
import { readFileSync } from "node:fs"
import puppeteer from "puppeteer"

const DEFAULT_OPTIONS: Options = {
  device: "desktop",
  max_tab: 3,
  retry: 2,
  timeout: 3000,
}

export async function requestResult(conf: GreenITConfig): Promise<GreenITResult> {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox", // can't run inside docker without
      "--disable-setuid-sandbox", // but security issues
    ],
    // Keep gpu horsepower in headless
    ignoreDefaultArgs: ["--disable-gpu"],
  })

  const options: Options = {
    ci: true,
    device: conf.device ?? DEFAULT_OPTIONS.device,
    max_tab: DEFAULT_OPTIONS.max_tab,
    retry: conf.retry ?? DEFAULT_OPTIONS.retry,
    timeout: conf.timeout ?? DEFAULT_OPTIONS.timeout,
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

    const r = await createJsonReports(browser, [{ url: conf.url }], options)

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
    const result = JSON.parse(readFileSync(reports[0].path, { encoding: "utf-8" })) as GreenITResult

    return result.success
      ? result
      : Promise.reject("Error during GreenIT analysis. Increasing the timeout can be a solution")
  }
}
