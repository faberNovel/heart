import { Config, ModuleAnalysisInterface, Result, Report } from "@fabernovel/heart-core"
import { App } from "../src/App.js"

test("Displays the results of an analysis", async () => {
  const report = new Report({
    analyzedUrl: "https://heart.fabernovel.com",
    date: new Date(),
    result: {},
    note: "50",
    normalizedNote: 50,
    service: {
      name: "Heart CLI",
    },
  })

  const module: ModuleAnalysisInterface<Config, Result> = {
    id: "test-analysis-tool",
    name: "Heart Test Analysis Tool",
    service: {
      name: "Test Analysis Tool",
    },
    startAnalysis: () => new Promise((resolve) => resolve(report)),
  }

  const startAnalysisMock = jest.spyOn(module, "startAnalysis")

  const app = new App([])
  await app.startAnalysis(module, {})

  expect(startAnalysisMock).toHaveBeenCalled()

  startAnalysisMock.mockRestore()
})
