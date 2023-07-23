import {
  type Config,
  type GenericReport,
  InputError,
  type ModuleAnalysisInterface,
  type ModuleListenerInterface,
  type ParsedAnalysisInput,
  type Result,
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
export const createAnalysisSubcommand = <C extends Config, R extends GenericReport<Result>>(
  analysisModule: ModuleAnalysisInterface<C, R>,
  listenerModules: ModuleListenerInterface[],
  callback: (
    config: C,
    threshold: number | undefined,
    listenerModulesFiltered: ModuleListenerInterface[]
  ) => Promise<void>
): Command => {
  const listenerModulesIds = listenerModules.map((listenerModule) => listenerModule.id)
  const subcommand = new Command(analysisModule.id)

  subcommand
    .description(`Analyzes a URL with ${analysisModule.service.name}`)
    .addOption(createConfigOption())
    .addOption(createThresholdOption())
    .addOption(createExceptListenersOption())
    .addOption(createOnlyListenersOption())
    .action(async (options: AnalysisOptions) => {
      try {
        const unvalidatedInputs = prepareOptionsForValidation(options)
        const { config, threshold, except_listeners, only_listeners } = validateAnalysisInput(
          unvalidatedInputs,
          listenerModulesIds
        )

        if (except_listeners !== undefined) {
          listenerModules = listenerModules.filter(
            (listenerModule) => !except_listeners.includes(listenerModule.id)
          )
        } else if (only_listeners !== undefined) {
          listenerModules = listenerModules.filter((listenerModules) =>
            only_listeners.includes(listenerModules.id)
          )
        }

        await callback(config as C, threshold, listenerModules)
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
