import {
  InputError,
  ModuleServerInterface,
  ParsedServerInput,
  validateServerInput,
} from "@fabernovel/heart-common"
import type { FastifyCorsOptions } from "@fastify/cors"
import { Command, InvalidArgumentError } from "commander"
import { ServerOptions, createCorsOption, createPortOption } from "./ServerOption.js"

function prepareOptionsForValidation(options: ServerOptions): ParsedServerInput {
  return {
    port: options.port,
    cors: options.cors,
  }
}

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
      try {
        const unvalidatedInputs = prepareOptionsForValidation(options)
        const { port, cors } = validateServerInput(unvalidatedInputs)

        await callback(port, cors)
      } catch (error) {
        if (error instanceof InputError) {
          throw new InvalidArgumentError(error.message)
        }
      }
    })

  return subcommand
}
