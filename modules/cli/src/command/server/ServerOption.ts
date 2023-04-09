import { InvalidArgumentError, Option } from "commander"
import type { JsonValue } from "type-fest"

export interface ServerOptions {
  port: number
  cors?: JsonValue
}

// the keys are used to create the options names:
// - options long names: keys names
// - options short names: first letter of the keys names
const SERVER_OPTIONS: { [key in keyof ServerOptions]-?: string } = {
  port: "port",
  cors: "cors",
}

const PORT_DEFAULT = 3000

export function createPortOption(): Option {
  return new Option(
    `-${SERVER_OPTIONS.port[0]}, --${SERVER_OPTIONS.port} [${SERVER_OPTIONS.port}]`,
    "Port that the server is listening to"
  )
    .default(PORT_DEFAULT)
    .argParser((value) => {
      const port = Number(value)

      if (isNaN(port)) {
        throw new InvalidArgumentError(`Must be a number`)
      }

      return port
    })
}

export function createCorsOption(): Option {
  return new Option(
    `-${SERVER_OPTIONS.cors[0]}, --${SERVER_OPTIONS.cors} [${SERVER_OPTIONS.cors}]`,
    "CORS configuration, as defined in https://github.com/fastify/fastify-cors#options"
  ).argParser((value) => JSON.parse(value) as JsonValue)
}
