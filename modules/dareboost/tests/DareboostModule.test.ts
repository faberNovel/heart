import { Report } from "@fabernovel/heart-common"
import { DareboostConfig } from "../src/config/Config"

import { DareboostModule } from "../src/DareboostModule"

import { ApiAnalysisResponse } from "./data/ApiAnalysisResponse"
import { ApiReportResponse } from "./data/ApiReportResponse"
import { Conf } from "./data/Conf"

const mockLaunchAnalysis = jest.fn().mockResolvedValue(ApiAnalysisResponse)
const mockGetAnalysisReport = jest.fn().mockResolvedValue(ApiReportResponse)
jest.mock("../src/api/Client", () => {
  return {
    Client: jest.fn().mockImplementation(() => {
      return {
        launchAnalysis: mockLaunchAnalysis,
        getAnalysisReport: mockGetAnalysisReport,
      }
    }),
  }
})

describe("Starts an analysis", () => {
  let module: DareboostModule

  beforeEach(() => {
    module = new DareboostModule({
      name: "Heart Dareboost Test",
      service: {
        name: "Dareboost Test",
      },
    })
  })

  it("should starts an analysis with a valid configuration", async () => {
    const expectedReport = new Report({
      analyzedUrl: Conf.url,
      date: new Date(ApiReportResponse.report.date),
      note: ApiReportResponse.report.summary.score.toString(),
      resultUrl: ApiReportResponse.report.publicReportUrl,
      service: {
        name: "Dareboost Test",
      },
    })

    const report = await module.startAnalysis(Conf)

    expect(report).toEqual(expectedReport)
  })

  it("should starts an analysis with an invalid configuration", async () => {
    try {
      await module.startAnalysis({} as DareboostConfig)
    } catch (e) {
      expect(e).toHaveProperty("error")
    }
  })

  it("Should start an analysis with an empty thresholds", async () => {
    const report = await module.startAnalysis(Conf)

    const expectedReport = new Report({
      analyzedUrl: Conf.url,
      date: new Date(ApiReportResponse.report.date),
      note: ApiReportResponse.report.summary.score.toString(),
      resultUrl: ApiReportResponse.report.publicReportUrl,
      normalizedNote: ApiReportResponse.report.summary.score,
      service: {
        name: "Dareboost Test",
      },
    })

    expect(report).toStrictEqual(expectedReport)
    expect(report.isThresholdReached()).toBeUndefined()
  })

  it("Should return false status when results do not match threshold objective", async () => {
    const THRESHOLD = 98

    const report = await module.startAnalysis(Conf, THRESHOLD)

    const expectedReport = new Report({
      analyzedUrl: Conf.url,
      date: new Date(ApiReportResponse.report.date),
      note: ApiReportResponse.report.summary.score.toString(),
      resultUrl: ApiReportResponse.report.publicReportUrl,
      normalizedNote: ApiReportResponse.report.summary.score,
      threshold: THRESHOLD,
      service: {
        name: "Dareboost Test",
      },
    })

    expect(report).toStrictEqual(expectedReport)
    expect(report.isThresholdReached()).toStrictEqual(false)
  })
})
