import { ObservatoryConfig, ObservatoryResult, Report } from "@fabernovel/heart-common"
import { jest } from "@jest/globals"
import { Scan } from "../src/api/model/Scan.js"

const ANALYZE_URL = "www.observatory.mozilla-test/results/"
const CONF: ObservatoryConfig = { host: "heart.fabernovel.com" }
const SCAN: Scan = {
  end_time: "May 13, 2022 5:58 PM",
  grade: "B",
  hidden: true,
  response_headers: {},
  scan_id: 1,
  score: 95,
  likelihood_indicator: "",
  start_time: "",
  state: "FINISHED",
  tests_failed: 3,
  tests_passed: 4,
  tests_quantity: 12,
}
const RESULT: ObservatoryResult = {
  "content-security-policy": {
    expectation: "csp-implemented-with-no-unsafe",
    name: "content-security-policy",
    output: {
      data: {},
    },
    pass: false,
    result: "csp-implemented-with-unsafe-inline-in-style-src-only",
    score_description:
      "Content Security Policy (CSP) implemented with unsafe-inline inside style-src directive",
    score_modifier: -5,
  },
}

jest.unstable_mockModule("../src/api/Client.js", () => {
  return {
    Client: jest.fn().mockImplementation(() => {
      return {
        getAnalyzeUrl: () => ANALYZE_URL + CONF.host,
        requestScan: () => Promise.resolve(SCAN),
        requestTests: () => Promise.resolve(RESULT),
        triggerAnalysis: () => Promise.resolve(SCAN),
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

    const expectedReport = new Report({
      analyzedUrl: "heart.fabernovel.com",
      date: report.date,
      result: RESULT,
      note: SCAN.grade,
      resultUrl: ANALYZE_URL + "heart.fabernovel.com",
      normalizedNote: SCAN.score > 100 ? 100 : SCAN.score,
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

    const expectedReport = new Report({
      analyzedUrl: "heart.fabernovel.com",
      date: report.date,
      result: RESULT,
      note: SCAN.grade,
      resultUrl: ANALYZE_URL + "heart.fabernovel.com",
      normalizedNote: SCAN.score > 100 ? 100 : SCAN.score,
      service: {
        name: "Observatory Test",
      },
    })

    expect(report).toStrictEqual(expectedReport)
    expect(report).toHaveProperty("threshold", undefined)
  })

  it("Should return false status when results do not match threshold objective", async () => {
    const THRESHOLD = 98
    const report = await module.startAnalysis(CONF, THRESHOLD)

    const expectedReport = new Report({
      analyzedUrl: "heart.fabernovel.com",
      date: report.date,
      result: RESULT,
      note: SCAN.grade,
      resultUrl: ANALYZE_URL + "heart.fabernovel.com",
      normalizedNote: SCAN.score > 100 ? 100 : SCAN.score,
      threshold: THRESHOLD,
      service: {
        name: "Observatory Test",
      },
    })

    expect(report).toStrictEqual(expectedReport)
    expect(report.isThresholdReached()).toEqual(false)
  })
})
