import { Config, GreenITReport, ModuleAnalysisInterface } from "@fabernovel/heart-common"
import { Command } from "commander"
import { createAnalysisCommand } from "../../src/command/AnalysisCommand.js"

test("Create an analysis command", () => {
  const report = new GreenITReport({
    analyzedUrl: "https://heart.fabernovel.com",
    date: new Date(),
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
    startAnalysis: () => new Promise((resolve) => resolve(report)),
  }

  const optionConfigInline = '{"url": "https://www.heart.fabernovel.com"}'

  const program = new Command()

  const analysisCommand = createAnalysisCommand(module, () => Promise.resolve())

  program.addCommand(analysisCommand)
  program.parse(["test-analysis-tool", "--inline", optionConfigInline], { from: "user" })

  expect(program.commands).toHaveLength(1)

  const command = program.commands[0]
  const options = command.opts()

  expect(command.name()).toBe(module.id)
  expect(Object.keys(options)).toHaveLength(1)
  expect(options).toHaveProperty("inline", optionConfigInline)
})
