import { Report } from "@fabernovel/heart-core"
import { ScanInterface } from "../src/api/model/Scan"
import { ObservatoryConfig } from "../src/config/Config"
import { ObservatoryModule } from "../src/ObservatoryModule"

const ANALYZE_URL = "www.observatory.mozilla-test/results/"
const API_URL = "www.observatory.mozilla-test/api/"
const CONF = { host: "heart.fabernovel.com" }
const SCAN: ScanInterface = {
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

const mockGetAnalysisReport = jest.fn().mockResolvedValue(SCAN)
const mockGetAnalyzeUrl = jest.fn().mockReturnValue(ANALYZE_URL + CONF.host)
const mockGetProjectHost = jest.fn().mockReturnValue(CONF.host)
const mockLaunchAnalysis = jest.fn().mockResolvedValue(SCAN)
jest.mock("../src/api/Client", () => {
  return {
    Client: jest.fn().mockImplementation(() => {
      return {
        getAnalysisReport: mockGetAnalysisReport,
        getAnalyzeUrl: mockGetAnalyzeUrl,
        getProjectHost: mockGetProjectHost,
        launchAnalysis: mockLaunchAnalysis,
      }
    }),
  }
})

describe("Starts an analysis", () => {
  let module: ObservatoryModule

  beforeEach(() => {
    process.env.OBSERVATORY_ANALYZE_URL = ANALYZE_URL
    process.env.OBSERVATORY_API_URL = API_URL

    module = new ObservatoryModule({
      name: "Heart Observatory Test",
      service: {
        name: "Observatory Test",
      },
    })
  })

  it("Should start an analysis with a valid configuration without a threshold", async () => {
    const report = await module.startAnalysis(CONF)

    const expectedReport = new Report({
      analyzedUrl: "heart.fabernovel.com",
      date: report.date,
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
