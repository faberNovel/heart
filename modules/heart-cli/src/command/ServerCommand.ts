import { ModuleServerInterface } from "@fabernovel/heart-core"
import { Command } from "commander"
import { CorsOptions } from "cors"

// the keys are used to create the options names:
// - options long names: keys names
// - options short names: first letter of the keys names
type Options = {
  port: string
  cors?: CorsOptions
}

const OPTIONS: { [key in keyof Options]-?: string } = {
  port: "port",
  cors: "cors",
}

const PORT_DEFAULT = "3000"
const PORT_REGEX =
  /^(0|[1-9][0-9]{0,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/

export class ServerCommand {
  /**
   * Create a command dedicated to the given server module
   */
  public static create(
    program: Command,
    module: ModuleServerInterface,
    callback: (port: number, corsOptions?: CorsOptions) => void
  ): void {
    program
      .command(module.id)
      .description(`Starts the ${module.name} server`)
      .option(
        `-${OPTIONS.port[0]}, --${OPTIONS.port} [${OPTIONS.port}]`,
        "Port that the server is listening to",
        (value: string) => (PORT_REGEX.test(value) ? value : PORT_DEFAULT),
        PORT_DEFAULT
      )
      .option(
        `-${OPTIONS.cors[0]}, --${OPTIONS.cors} [${OPTIONS.cors}]`,
        "CORS configuration, as defined in https://www.npmjs.com/package/cors#configuration-options",
        (value: string) => {
          try {
            return JSON.parse(value) as CorsOptions
          } catch (error) {
            console.error(error)
            program.help()
          }
        }
      )
      .action((options: Options) => {
        const { cors, port } = options

        callback(Number(port), cors)
      })
  }
}
