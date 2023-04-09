import {
  Config,
  GenericReport,
  InputError,
  ModuleAnalysisInterface,
  ModuleListenerInterface,
  ParsedInput,
  Result,
  validateAnalysisInput,
} from "@fabernovel/heart-common"
import { Command, InvalidArgumentError } from "commander"
import {
  AnalysisOptions,
  createConfigOption,
  createExceptListenersOption,
  createOnlyListenersOption,
  createThresholdOption,
} from "./AnalysisOption.js"

function prepareOptionsForValidation(options: AnalysisOptions): ParsedInput {
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
      const { config, threshold, exceptListeners, onlyListeners } = options

      try {
        const data = prepareOptionsForValidation(options)
        validateAnalysisInput(data, listenerModulesIds)

        if (exceptListeners !== undefined) {
          listenerModules = listenerModules.filter(
            (listenerModule) => !exceptListeners.includes(listenerModule.id)
          )
        } else if (onlyListeners !== undefined) {
          listenerModules = listenerModules.filter((listenerModules) =>
            onlyListeners.includes(listenerModules.id)
          )
        }

        await callback(config as C, threshold, listenerModules)
      } catch (error) {
        if (error instanceof InputError) {
          throw new InvalidArgumentError(error.message)
        }
      }
    })

  return subcommand
}
