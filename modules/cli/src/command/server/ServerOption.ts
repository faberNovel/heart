import { Option } from "commander"
import type { CorsOptions } from "cors"

export type ServerOptions = {
  port: string
  cors?: CorsOptions
}

// the keys are used to create the options names:
// - options long names: keys names
// - options short names: first letter of the keys names
const SERVER_OPTIONS: { [key in keyof ServerOptions]-?: string } = {
  port: "port",
  cors: "cors",
}

const PORT_DEFAULT = "3000"
const PORT_REGEX =
  /^(0|[1-9][0-9]{0,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/

export function createPortOption(): Option {
  return new Option(
    `-${SERVER_OPTIONS.port[0]}, --${SERVER_OPTIONS.port} [${SERVER_OPTIONS.port}]`,
    "Port that the server is listening to"
  )
    .default(PORT_DEFAULT)
    .argParser((value) => {
      return PORT_REGEX.test(value) ? value : PORT_DEFAULT
    })
}

export function createCorsOption(): Option {
  return new Option(
    `-${SERVER_OPTIONS.cors[0]}, --${SERVER_OPTIONS.cors} [${SERVER_OPTIONS.cors}]`,
    "CORS configuration, as defined in https://www.npmjs.com/package/cors#configuration-options"
  ).argParser((value) => JSON.parse(value) as CorsOptions)
}
