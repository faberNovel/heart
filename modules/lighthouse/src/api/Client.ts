import type { LighthouseConfig, LighthouseReport } from "@fabernovel/heart-common"
import lighthouse from "lighthouse"
import puppeteer from "puppeteer"

/**
 * @see {@link https://github.com/GoogleChrome/lighthouse/blob/main/docs/puppeteer.md#option-2-launch-chrome-with-lighthousechrome-launcher-and-handoff-to-puppeteer}
 */
export async function requestResult(
  conf: LighthouseConfig,
  verbose: boolean
): Promise<LighthouseReport["result"]> {
  const browser = await puppeteer.launch({
    // https://www.howtogeek.com/devops/how-to-run-puppeteer-and-headless-chrome-in-a-docker-container/#using-puppeteer-in-docker
    args: ["--disable-gpu", "--disable-dev-shm-usage", "--disable-setuid-sandbox", "--no-sandbox"],
    defaultViewport: null,
    // https://developer.chrome.com/articles/new-headless/
    headless: "new",
  })
  const page = await browser.newPage()

  const runnerResult = await lighthouse(
    conf.url,
    { output: "json", logLevel: verbose ? "info" : undefined },
    conf.config,
    page
  )
  if (undefined === runnerResult) {
    return Promise.reject(
      "The analysis run, but Lighthouse did not return any result. Try to start your analysis again."
    )
  }

  await browser.close()

  return { ...runnerResult.lhr } // hacky thing to fix weird typing error
}
