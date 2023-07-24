import type { ModuleMetadata } from "@fabernovel/heart-common"
import { Command } from "commander"
import { createAnalysisSubcommand } from "../../src/command/analysis/AnalysisCommand.js"
import type { PackageJsonModule } from "../../src/module/PackageJson.js"

test("Create an analysis command", () => {
  const moduleMetadata: ModuleMetadata = {
    id: "test-analysis-tool",
    name: "Heart Test Analysis Tool",
    service: {
      name: "Test Analysis Tool",
    },
  }

  const listenerModules = new Map<string, PackageJsonModule>()

  const optionConfigInline = '{"url": "https://www.heart.fabernovel.com"}'

  const program = new Command()

  const analysisCommand = createAnalysisSubcommand(moduleMetadata, listenerModules, () => Promise.resolve())

  program.addCommand(analysisCommand)
  program.parse(["test-analysis-tool", "--config", optionConfigInline], { from: "user" })

  expect(program.commands).toHaveLength(1)

  const command = program.commands[0]
  const options = command.opts()

  expect(command.name()).toBe(moduleMetadata.id)
  expect(Object.keys(options)).toHaveLength(2)
  expect(options).toHaveProperty("config", JSON.parse(optionConfigInline))
  expect(options).toHaveProperty("verbose", false)
})
