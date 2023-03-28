import { InputError, ModuleServerInterface, validateServerInput } from "@fabernovel/heart-common"
import type { FastifyCorsOptions } from "@fastify/cors"
import { Command, InvalidArgumentError } from "commander"
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

      try {
        validateServerInput(port)

        await callback(port, cors)
      } catch (error) {
        if (error instanceof InputError) {
          throw new InvalidArgumentError(error.message)
        }
      }
    })

  return subcommand
}
