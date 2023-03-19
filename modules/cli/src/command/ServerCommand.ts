import { ModuleServerInterface } from "@fabernovel/heart-common"
import { Command } from "commander"
import { CorsOptions } from "cors"
import { BaseOptions, createBaseSubcommand } from "./BaseCommand.js"

type ServerOptions = {
  port: string
  cors?: CorsOptions
}

type Options = BaseOptions & ServerOptions

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

/**
 * Create a command dedicated to the given server module
 */
export const createServerSubcommand = (
  module: ModuleServerInterface,
  callback: (port: number, corsOptions?: CorsOptions) => void
): Command => {
  const subcommand = createBaseSubcommand(module.id, `Starts the ${module.name} server`)

  subcommand
    .option(
      `-${SERVER_OPTIONS.port[0]}, --${SERVER_OPTIONS.port} [${SERVER_OPTIONS.port}]`,
      "Port that the server is listening to",
      (value: string) => (PORT_REGEX.test(value) ? value : PORT_DEFAULT),
      PORT_DEFAULT
    )
    .option(
      `-${SERVER_OPTIONS.cors[0]}, --${SERVER_OPTIONS.cors} [${SERVER_OPTIONS.cors}]`,
      "CORS configuration, as defined in https://www.npmjs.com/package/cors#configuration-options",
      (value: string) => JSON.parse(value) as CorsOptions
    )
    .action((options: Options) => {
      console.log(options)
      const { cors, port } = options

      callback(Number(port), cors)
    })

  return subcommand
}
