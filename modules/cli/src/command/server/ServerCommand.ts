import {
  InputError,
  validateServerInput,
  type ModuleMetadata,
  type ParsedServerInput,
} from "@fabernovel/heart-common"
import type { FastifyCorsOptions } from "@fastify/cors"
import { Command, InvalidArgumentError } from "commander"
import { createVerboseOption } from "../CommonOption.js"
import { createCorsOption, createPortOption, type ServerOptions } from "./ServerOption.js"

function prepareOptionsForValidation(options: ServerOptions): ParsedServerInput {
  return {
    cors: options.cors,
    port: options.port,
    verbose: options.verbose,
  }
}

/**
 * Create a command dedicated to the given server module
 */
export const createServerSubcommand = (
  moduleMetadata: ModuleMetadata,
  callback: (verbose: boolean, port: number, corsOptions: FastifyCorsOptions | undefined) => Promise<void>
): Command => {
  const subcommand = new Command(moduleMetadata.id)

  subcommand
    .description(`Starts the ${moduleMetadata.name} server`)
    .addOption(createVerboseOption())
    .addOption(createPortOption())
    .addOption(createCorsOption())
    .action(async (options: ServerOptions) => {
      try {
        const unvalidatedInputs = prepareOptionsForValidation(options)
        const { cors, port, verbose } = validateServerInput(unvalidatedInputs)

        await callback(verbose, port, cors)
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
