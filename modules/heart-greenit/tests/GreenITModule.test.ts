import { Report } from "@fabernovel/heart-core"
import { createJsonReports } from "greenit-cli/cli-core/analysis"
import { join } from "node:path"
import { GreenITModule } from "../src/GreenITModule.js"
import { conf } from "./data/Conf.js"
import successResult from "./data/successReport.json"

jest.mock("greenit-cli/cli-core/analysis")
const mockedCreateJsonReports = jest.mocked(createJsonReports)

describe("Run GreenIT analysis", () => {
  it("should be able to launch a successful analysis without thresholds", async () => {
    mockedCreateJsonReports.mockResolvedValue([
      {
        path: join(__dirname, "./data/successReport.json"),
        name: "1.json",
      },
    ])

    const moduleConfig = {
      id: "1234",
      name: "Green IT",
      service: {
        name: "Green IT",
        logo: "some-logo",
      },
    }

    const module = new GreenITModule(moduleConfig)
    const analysisReport = await module.startAnalysis(conf)

    const [date, time] = successResult.date.split(" ")
    const [day, month, year] = date.split("/")

    const mockReport = new Report({
      analyzedUrl: successResult.url,
      date: new Date(`${year}-${month}-${day}T${time}`),
      result: successResult,
      note: successResult.ecoIndex.toString(),
      service: moduleConfig.service,
      threshold: undefined,
    })
    expect(analysisReport).toStrictEqual(mockReport)
  })

  it("should be able to handle a failed analysis", async () => {
    mockedCreateJsonReports.mockResolvedValue([
      {
        path: join(__dirname, "./data/errorReport.json"),
        name: "1.json",
      },
    ])

    const moduleConfig = {
      id: "1234",
      name: "Green IT",
      service: {
        name: "Green IT",
        logo: "some-logo",
      },
    }

    const errorMessage = "Error during GreenIT analysis. Increasing the timeout can be a solution"
    const module = new GreenITModule(moduleConfig)

    try {
      await module.startAnalysis(conf)
    } catch (error) {
      expect(error).toBe(errorMessage)
    }
  })

  it("should be able to launch a successful analysis with thresholds", async () => {
    const now = new Date()

    mockedCreateJsonReports.mockResolvedValue([
      {
        path: join(__dirname, "./data/successReport.json"),
        name: "1.json",
      },
    ])

    const moduleConfig = {
      id: "1234",
      name: "Green IT",
      service: {
        name: "Green IT",
        logo: "some-logo",
      },
    }

    const THRESHOLD = 30

    const module = new GreenITModule(moduleConfig)
    const analysisReport = await module.startAnalysis(conf, THRESHOLD)
    analysisReport.date = now

    const mockReport = new Report({
      analyzedUrl: successResult.url,
      date: now,
      result: successResult,
      note: successResult.ecoIndex.toString(),
      service: moduleConfig.service,
      threshold: THRESHOLD,
    })

    expect(analysisReport).toStrictEqual(mockReport)
  })

  it("Should return false when results do not match thresholds objectives", async () => {
    const now = new Date()

    mockedCreateJsonReports.mockResolvedValue([
      {
        path: join(__dirname, "./data/successReport.json"),
        name: "1.json",
      },
    ])

    const moduleConfig = {
      id: "1234",
      name: "Green IT",
      service: {
        name: "Green IT",
        logo: "some-logo",
      },
    }

    const THRESHOLD = 30

    const module = new GreenITModule(moduleConfig)
    const analysisReport = await module.startAnalysis(conf, THRESHOLD)
    analysisReport.date = now

    const mockReport = new Report({
      analyzedUrl: successResult.url,
      date: now,
      result: successResult,
      note: successResult.ecoIndex.toString(),
      service: moduleConfig.service,
      threshold: THRESHOLD,
    })

    expect(analysisReport).toStrictEqual(mockReport)
    expect(analysisReport.isThresholdReached()).toStrictEqual(false)
  })
})
