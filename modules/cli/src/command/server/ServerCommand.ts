import type { ModuleServerInterface } from "@fabernovel/heart-common"
import type { FastifyCorsOptions } from "@fastify/cors"
import { Command } from "commander"
import type { ServerOptions } from "./ServerOption.js"
import { createCorsOption, createPortOption } from "./ServerOption.js"

/**
 * Create a command dedicated to the given server module
 */
export const createServerSubcommand = (
  module: ModuleServerInterface,
  callback: (port: number, corsOptions: FastifyCorsOptions | undefined) => Promise<void>
): Command => {
  const subcommand = new Command(module.id)

  subcommand
    .description(`Starts the ${module.name} server`)
    .addOption(createPortOption())
    .addOption(createCorsOption())
    .action(async (options: ServerOptions) => {
      const { cors, port } = options

      await callback(Number(port), cors)
    })

  return subcommand
}
