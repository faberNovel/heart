import { ModuleServerInterface } from "@fabernovel/heart-core"
import { Command } from "commander"
import { createServer } from "http"
import { ServerCommand } from "../../src/command/ServerCommand"

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
  ServerCommand.create(program, module, () => {})

  program.parse(["test-server", "--port", optionPort, "--cors", optionCors], { from: "user" })

  expect(program.commands).toHaveLength(1)

  const command = program.commands.shift() as Command
  const options = command.opts()

  console.log(options)

  expect(command.name()).toBe(module.id)
  expect(Object.keys(options)).toHaveLength(2)
  expect(options).toHaveProperty("port", optionPort)
  expect(options).toHaveProperty("cors", JSON.parse(optionCors))
})
