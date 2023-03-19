import { ModuleServerInterface } from "@fabernovel/heart-common"
import { Command } from "commander"
import { CorsOptions } from "cors"
import { createCorsOption, createPortOption, ServerOptions } from "./ServerOption.js"

/**
 * Create a command dedicated to the given server module
 */
export const createServerSubcommand = (
  module: ModuleServerInterface,
  callback: (port: number, corsOptions: CorsOptions | undefined) => void
): Command => {
  const subcommand = new Command(module.id)

  subcommand
    .description(`Starts the ${module.name} server`)
    .addOption(createPortOption())
    .addOption(createCorsOption())
    .action((options: ServerOptions) => {
      const { cors, port } = options

      callback(Number(port), cors)
    })

  return subcommand
}
