import { launch } from "chrome-launcher"
import lighthouse from "lighthouse"
import { LighthouseConfig } from "../config/Config"

export async function runAnalysis(conf: LighthouseConfig): Promise<LH.Result> {
  const chrome = await launch({ chromeFlags: ["--headless", "--no-sandbox"] })

  const runnerResult = await lighthouse(conf.url, { port: chrome.port, output: "json" }, conf.config)
  if (undefined === runnerResult) {
    return Promise.reject(
      "The analysis run, but Lighthouse did not return any result. Try to start your analysis again."
    )
  }

  await chrome.kill()

  return runnerResult.lhr
}
