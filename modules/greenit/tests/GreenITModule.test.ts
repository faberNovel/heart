import type { ModuleMetadata } from "@fabernovel/heart-common"
import { jest } from "@jest/globals"
import { Conf } from "./data/Conf.js"
import SuccessResult from "./data/SuccessResult.json" assert { type: "json" }

jest.unstable_mockModule("greenit-cli/cli-core/analysis.js", () => ({
  createJsonReports: jest.fn(),
}))
const { createJsonReports } = await import("greenit-cli/cli-core/analysis.js")
const mockedCreateJsonReports = jest.mocked(createJsonReports)

const { GreenITModule } = await import("../src/GreenITModule.js")

describe("Run GreenIT analysis", () => {
  it("should be able to launch a successful analysis without thresholds", async () => {
    mockedCreateJsonReports.mockResolvedValue([
      {
        path: new URL("./data/SuccessResult.json", import.meta.url).pathname,
        name: "1.json",
      },
    ])

    const moduleConfig: ModuleMetadata = {
      id: "1234",
      type: "analysis",
      name: "Green IT",
      service: {
        name: "Green IT",
        logoUrl: "some-logo",
      },
    }

    const module = new GreenITModule(moduleConfig)
    const analysisReport = await module.startAnalysis(Conf)

    const [date, time] = SuccessResult.date.split(" ")
    const [day, month, year] = date.split("/")

    expect(analysisReport).toHaveProperty("analyzedUrl", SuccessResult.url)
    expect(analysisReport).toHaveProperty("date", new Date(`${year}-${month}-${day}T${time}`))
    expect(analysisReport).toHaveProperty("grade", SuccessResult.grade)
    expect(analysisReport).toHaveProperty("normalizedGrade", SuccessResult.ecoIndex)
    expect(analysisReport).toHaveProperty("service", moduleConfig.service)
    expect(analysisReport).toHaveProperty("inputs", { config: Conf })
  })

  it("should be able to handle a failed analysis", async () => {
    mockedCreateJsonReports.mockResolvedValue([
      {
        path: new URL("./data/ErrorResult.json", import.meta.url).pathname,
        name: "1.json",
      },
    ])

    const moduleConfig: ModuleMetadata = {
      id: "1234",
      type: "analysis",
      name: "Green IT",
      service: {
        name: "Green IT",
        logoUrl: "some-logo",
      },
    }

    const errorMessage = "Error during GreenIT analysis. Increasing the timeout can be a solution"
    const module = new GreenITModule(moduleConfig)

    try {
      await module.startAnalysis(Conf)
    } catch (error) {
      expect(error).toBe(errorMessage)
    }
  })

  it("should be able to launch a successful analysis with thresholds", async () => {
    mockedCreateJsonReports.mockResolvedValue([
      {
        path: new URL("./data/SuccessResult.json", import.meta.url).pathname,
        name: "1.json",
      },
    ])

    const moduleConfig: ModuleMetadata = {
      id: "1234",
      type: "analysis",
      name: "Green IT",
      service: {
        name: "Green IT",
        logoUrl: "some-logo",
      },
    }

    const THRESHOLD = 30

    const module = new GreenITModule(moduleConfig)
    const analysisReport = await module.startAnalysis(Conf, THRESHOLD)

    expect(analysisReport).toHaveProperty("analyzedUrl", SuccessResult.url)
    expect(analysisReport).toHaveProperty("date")
    expect(analysisReport).toHaveProperty("grade", SuccessResult.grade)
    expect(analysisReport).toHaveProperty("normalizedGrade", SuccessResult.ecoIndex)
    expect(analysisReport).toHaveProperty("service", moduleConfig.service)
    expect(analysisReport).toHaveProperty("inputs", { config: Conf, threshold: THRESHOLD })
  })

  it("Should return false when results do not match thresholds objectives", async () => {
    mockedCreateJsonReports.mockResolvedValue([
      {
        path: new URL("./data/SuccessResult.json", import.meta.url).pathname,
        name: "1.json",
      },
    ])

    const moduleConfig: ModuleMetadata = {
      id: "1234",
      type: "analysis",
      name: "Green IT",
      service: {
        name: "Green IT",
        logoUrl: "some-logo",
      },
    }

    const THRESHOLD = 30

    const module = new GreenITModule(moduleConfig)
    const analysisReport = await module.startAnalysis(Conf, THRESHOLD)

    expect(analysisReport).toHaveProperty("analyzedUrl", SuccessResult.url)
    expect(analysisReport).toHaveProperty("date")
    expect(analysisReport).toHaveProperty("grade", SuccessResult.grade)
    expect(analysisReport).toHaveProperty("normalizedGrade", SuccessResult.ecoIndex)
    expect(analysisReport).toHaveProperty("service", moduleConfig.service)
    expect(analysisReport).toHaveProperty("inputs", { config: Conf, threshold: THRESHOLD })
    expect(analysisReport.isThresholdReached()).toStrictEqual(false)
  })
})
