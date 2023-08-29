import type { ModuleMetadata } from "@fabernovel/heart-common"
import { Command } from "commander"
import { createAnalysisSubcommand } from "../../src/command/analysis/AnalysisCommand.js"
import type { PackageJsonModule } from "../../src/module/PackageJson.js"

const optionConfigInline = '{"url": "https://www.heart.fabernovel.com"}'
let program: Command

beforeEach(() => {
  program = new Command()
  const analysisModuleMetadata: ModuleMetadata = {
    id: "analysis",
    type: "analysis",
    name: "Heart Test Analysis Tool",
    service: {
      name: "Test Analysis Tool",
    },
  }

  const listenerModulesMetadataMap = new Map<string, PackageJsonModule>([
    [
      "path/to/listener1",
      {
        name: "",
        main: "",
        heart: {
          id: "listener1",
          name: "Listener 1",
          type: "listener",
          service: { name: "Listener 1 service" },
        },
      },
    ],
    [
      "path/to/listener2",
      {
        name: "",
        main: "",
        heart: {
          id: "listener2",
          name: "Listener 2",
          type: "listener",
          service: { name: "Listener 2 service" },
        },
      },
    ],
  ])

  const analysisCommand = createAnalysisSubcommand(analysisModuleMetadata, listenerModulesMetadataMap, () =>
    Promise.resolve()
  )

  program.addCommand(analysisCommand)
})

test("Create an analysis command with all the listener modules", () => {
  program.parse(["analysis", "--config", optionConfigInline], { from: "user" })

  expect(program.commands).toHaveLength(1)

  const command = program.commands[0]
  const options = command.opts()

  expect(command.name()).toBe("analysis")
  expect(Object.keys(options)).toHaveLength(2)
  expect(options).toHaveProperty("config", JSON.parse(optionConfigInline))
  expect(options).toHaveProperty("verbose", false)
})

test("Create an analysis command with only 1 listener modules using the --except-listeners option", () => {
  program.parse(["analysis", "--config", optionConfigInline, "--except-listeners", "listener1"], {
    from: "user",
  })

  expect(program.commands).toHaveLength(1)

  const command = program.commands[0]
  const options = command.opts()

  expect(command.name()).toBe("analysis")
  expect(Object.keys(options)).toHaveLength(3)
  expect(options).toHaveProperty("config", JSON.parse(optionConfigInline))
  expect(options).toHaveProperty("verbose", false)
  expect(options).toHaveProperty("exceptListeners", ["listener1"])
})

test("Create an analysis command with only 1 listener modules using the --only-listeners option", () => {
  program.parse(["analysis", "--config", optionConfigInline, "--only-listeners", "listener1"], {
    from: "user",
  })

  expect(program.commands).toHaveLength(1)

  const command = program.commands[0]
  const options = command.opts()

  expect(command.name()).toBe("analysis")
  expect(Object.keys(options)).toHaveLength(3)
  expect(options).toHaveProperty("config", JSON.parse(optionConfigInline))
  expect(options).toHaveProperty("verbose", false)
  expect(options).toHaveProperty("onlyListeners", ["listener1"])
})
