import {
  InputError,
  type ModuleMetadata,
  type ParsedServerInput,
  validateServerInput,
} from "@fabernovel/heart-common"
import type { FastifyCorsOptions } from "@fastify/cors"
import { Command, InvalidArgumentError } from "commander"
import { type ServerOptions, createCorsOption, createPortOption } from "./ServerOption.js"

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
  moduleMetadata: ModuleMetadata,
  callback: (port: number, corsOptions: FastifyCorsOptions | undefined) => Promise<void>
): Command => {
  const subcommand = new Command(moduleMetadata.id)

  subcommand
    .description(`Starts the ${moduleMetadata.name} server`)
    .addOption(createPortOption())
    .addOption(createCorsOption())
    .action(async (options: ServerOptions) => {
      try {
        const unvalidatedInputs = prepareOptionsForValidation(options)
        const { port, cors } = validateServerInput(unvalidatedInputs)

        await callback(port, cors)
      } catch (error) {
        if (error instanceof InputError) {
          const e = new InvalidArgumentError(error.message)
          return Promise.reject(e)
        } else {
          return Promise.reject(error)
        }
      }
    })

  return subcommand
}
