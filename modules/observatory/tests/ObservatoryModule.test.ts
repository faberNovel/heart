import { type ObservatoryConfig, ObservatoryReport } from "@fabernovel/heart-common"
import { jest } from "@jest/globals"
import { RESULT } from "./data/Result.js"

const ANALYZE_URL = "www.observatory.mozilla-test/results/"
const CONF: ObservatoryConfig = { host: "heart.fabernovel.com" }

jest.unstable_mockModule("../src/api/Client.js", () => {
  return {
    Client: jest.fn().mockImplementation(() => {
      return {
        getAnalyzeUrl: () => ANALYZE_URL + CONF.host,
        requestScan: () => Promise.resolve(RESULT.scan),
        requestTests: () => Promise.resolve(RESULT.tests),
        triggerAnalysis: () => Promise.resolve(RESULT.scan),
      }
    }),
  }
})
await import("../src/api/Client.js")
const { ObservatoryModule } = await import("../src/ObservatoryModule.js")

describe("Starts an analysis", () => {
  const module = new ObservatoryModule({
    name: "Heart Observatory Test",
    service: {
      name: "Observatory Test",
    },
  })

  it("Should start an analysis with a valid configuration without a threshold", async () => {
    const report = await module.startAnalysis(CONF)

    const expectedReport = new ObservatoryReport({
      analyzedUrl: "heart.fabernovel.com",
      date: report.date,
      inputs: {
        config: CONF,
      },
      result: RESULT,
      resultUrl: ANALYZE_URL + "heart.fabernovel.com",
      service: {
        name: "Observatory Test",
      },
    })

    expect(report).toEqual(expectedReport)
  })

  it("Should throw an error with an invalid configuration", async () => {
    try {
      await module.startAnalysis({} as ObservatoryConfig)
    } catch (e) {
      expect(e).toHaveProperty("error")
    }
  })

  it("Should start an analysis with an empty threshold", async () => {
    const report = await module.startAnalysis(CONF)

    const expectedReport = new ObservatoryReport({
      analyzedUrl: "heart.fabernovel.com",
      date: report.date,
      inputs: {
        config: CONF,
      },
      result: RESULT,
      resultUrl: ANALYZE_URL + "heart.fabernovel.com",
      service: {
        name: "Observatory Test",
      },
    })

    expect(report).toStrictEqual(expectedReport)
    expect(report).toHaveProperty("inputs", { config: CONF })
  })

  it("Should return false status when results do not match threshold objective", async () => {
    const THRESHOLD = 98
    const report = await module.startAnalysis(CONF, THRESHOLD)

    const expectedReport = new ObservatoryReport({
      analyzedUrl: "heart.fabernovel.com",
      date: report.date,
      inputs: {
        config: CONF,
        threshold: THRESHOLD,
      },
      result: RESULT,
      resultUrl: ANALYZE_URL + "heart.fabernovel.com",
      service: {
        name: "Observatory Test",
      },
    })

    expect(report).toStrictEqual(expectedReport)
    expect(report.isThresholdReached()).toEqual(false)
  })
})
