import type { ModuleServerInterface } from "@fabernovel/heart-common"
import { Command } from "commander"
import { createServer } from "http"
import { createServerSubcommand } from "../../src/command/server/ServerCommand.js"

test("Create a server command", () => {
  const module: ModuleServerInterface = {
    id: "test-server",
    name: "Heart Test Server",
    service: {
      name: "Test Server",
    },
    startServer: () => createServer(),
  }

  const optionCors = '{"origin":"http://127.0..0.1:8080/"}'
  const optionPort = "3000"

  const program = new Command()

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const serverCommand = createServerSubcommand(module, () => {})

  program.addCommand(serverCommand)
  program.parse(["test-server", "--port", optionPort, "--cors", optionCors], { from: "user" })

  expect(program.commands).toHaveLength(1)

  const command = program.commands[0]
  const options = command.opts()

  expect(command.name()).toBe(module.id)
  expect(Object.keys(options)).toHaveLength(2)
  expect(options).toHaveProperty("port", optionPort)
  expect(options).toHaveProperty("cors", JSON.parse(optionCors))
})
