import { ModuleServerInterface, validateServerInput } from "@fabernovel/heart-common"
import type { FastifyCorsOptions } from "@fastify/cors"
import { Command } from "commander"
import { createCorsOption, createPortOption, ServerOptions } from "./ServerOption.js"

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

      const [validatedPort] = validateServerInput(port)

      await callback(validatedPort, cors)
    })

  return subcommand
}
