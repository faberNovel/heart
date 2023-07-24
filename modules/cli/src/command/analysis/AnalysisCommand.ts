import {
  type Config,
  InputError,
  type ModuleMetadata,
  type ParsedAnalysisInput,
  validateAnalysisInput,
} from "@fabernovel/heart-common"
import { Command, InvalidArgumentError } from "commander"
import {
  type AnalysisOptions,
  createConfigOption,
  createExceptListenersOption,
  createOnlyListenersOption,
  createThresholdOption,
} from "./AnalysisOption.js"
import type { PackageJsonModule } from "../../module/PackageJson.js"

function prepareOptionsForValidation(options: AnalysisOptions): ParsedAnalysisInput {
  return {
    config: options.config,
    threshold: options.threshold,
    except_listeners: options.exceptListeners,
    only_listeners: options.onlyListeners,
  }
}

/**
 * Create a command dedicated to the given analysis module
 */
export const createAnalysisSubcommand = <C extends Config>(
  moduleMetadata: ModuleMetadata,
  listenerModulesMetadataMap: Map<string, PackageJsonModule>,
  callback: (
    config: C,
    threshold: number | undefined,
    listenerModulesMetadataMapFiltered: Map<string, PackageJsonModule>
  ) => Promise<void>
): Command => {
  const subcommand = new Command(moduleMetadata.id)

  subcommand
    .description(`Analyzes a URL with ${moduleMetadata.service.name}`)
    .addOption(createConfigOption())
    .addOption(createThresholdOption())
    .addOption(createExceptListenersOption())
    .addOption(createOnlyListenersOption())
    .action(async (options: AnalysisOptions) => {
      try {
        const listenerModulesIds = new Array<string>()
        listenerModulesMetadataMap.forEach((metadata) => {
          listenerModulesIds.push(metadata.heart.id)
        })
        const unvalidatedInputs = prepareOptionsForValidation(options)
        const { config, threshold, except_listeners, only_listeners } = validateAnalysisInput(
          unvalidatedInputs,
          listenerModulesIds
        )

        if (except_listeners !== undefined) {
          listenerModulesMetadataMap.forEach((metadata, modulePath, m) => {
            if (except_listeners.includes(metadata.heart.id)) {
              m.delete(modulePath)
            }
          })
        } else if (only_listeners !== undefined) {
          listenerModulesMetadataMap.forEach((metadata, modulePath, m) => {
            if (!only_listeners.includes(metadata.heart.id)) {
              m.delete(modulePath)
            }
          })
        }

        await callback(config as C, threshold, listenerModulesMetadataMap)
      } catch (error) {
        if (error instanceof InputError) {
          const e = new InvalidArgumentError(error.cause[0].message ?? error.message)
          return Promise.reject(e)
        } else {
          return Promise.reject(error)
        }
      }
    })

  return subcommand
}
