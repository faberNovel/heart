import { type Config, type ModuleAnalysisInterface, GreenITReport } from "@fabernovel/heart-common"
import { jest } from "@jest/globals"
import { startAnalysis } from "../../src/module/ModuleOrchestrator.js"

test("Displays the results of an analysis", async () => {
  const report = new GreenITReport({
    analyzedUrl: "https://heart.fabernovel.com",
    date: new Date(),
    inputs: {
      config: {},
    },
    result: {
      grade: "B",
      ecoIndex: 50,
    } as unknown as GreenITReport["result"],
    service: {
      name: "Heart CLI",
    },
  })

  const module: ModuleAnalysisInterface<Config, GreenITReport> = {
    id: "test-analysis-tool",
    name: "Heart Test Analysis Tool",
    service: {
      name: "Test Analysis Tool",
    },
    startAnalysis: () =>
      new Promise((resolve) => {
        resolve(report)
      }),
  }

  const startAnalysisMock = jest.spyOn(module, "startAnalysis")

  await startAnalysis(module, {})

  expect(startAnalysisMock).toHaveBeenCalled()

  startAnalysisMock.mockRestore()
})
