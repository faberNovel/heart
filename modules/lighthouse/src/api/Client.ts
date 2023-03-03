import type { LighthouseConfig, LighthouseResult } from "@fabernovel/heart-common"
import lighthouse from "lighthouse"
import puppeteer from "puppeteer"

/**
 *
 * @link https://github.com/GoogleChrome/lighthouse/blob/main/docs/puppeteer.md#option-2-launch-chrome-with-lighthousechrome-launcher-and-handoff-to-puppeteer
 */
export async function requestResult(conf: LighthouseConfig): Promise<LighthouseResult> {
  const browser = await puppeteer.launch({
    defaultViewport: null,
    args: [
      "--no-sandbox",
      // The /dev/shm partition is too small in certain VM environments, causing Chrome to fail or crash (see http://crbug.com/715363).
      // Use this flag to work-around this issue (a temporary directory will always be used to create anonymous shared memory files).
      // @see {@link https://peter.sh/experiments/chromium-command-line-switches/#disable-dev-shm-usage}
      "--disable-dev-shm-usage",
    ],
  })
  const page = await browser.newPage()

  const runnerResult = await lighthouse(conf.url, { output: "json" }, conf.config, page)
  if (undefined === runnerResult) {
    return Promise.reject(
      "The analysis run, but Lighthouse did not return any result. Try to start your analysis again."
    )
  }

  await browser.close()

  return { ...runnerResult.lhr } // hacky thing to fix weird typing error
}
