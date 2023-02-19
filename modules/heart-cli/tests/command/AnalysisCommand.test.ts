import { Config, ModuleAnalysisInterface, Result, Report } from "@fabernovel/heart-core"
import { Command } from "commander"
import { createAnalysisCommand } from "../../src/command/AnalysisCommand.js"

test("Create an analysis command", () => {
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
