import { launch } from "chrome-launcher"
import lighthouse from "lighthouse"
import type { LighthouseConfig, LighthouseResult } from "@fabernovel/heart-core"

export async function runAnalysis(conf: LighthouseConfig): Promise<LighthouseResult> {
  const chrome = await launch({
    chromeFlags: [
      "--headless",
      "--no-sandbox",
      // The /dev/shm partition is too small in certain VM environments, causing Chrome to fail or crash (see http://crbug.com/715363).
      // Use this flag to work-around this issue (a temporary directory will always be used to create anonymous shared memory files).
      // @see {@link https://peter.sh/experiments/chromium-command-line-switches/#disable-dev-shm-usage}
      "--disable-dev-shm-usage",
    ],
  })

  const runnerResult = await lighthouse(conf.url, { port: chrome.port, output: "json" }, conf.config)
  if (undefined === runnerResult) {
    return Promise.reject(
      "The analysis run, but Lighthouse did not return any result. Try to start your analysis again."
    )
  }

  await chrome.kill()

  return { ...runnerResult.lhr } // weird hacky thing
}
