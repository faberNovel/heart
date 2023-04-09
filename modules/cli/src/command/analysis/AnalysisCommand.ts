import {
  Config,
  GenericReport,
  InputError,
  ModuleAnalysisInterface,
  ModuleListenerInterface,
  Result,
  validateAnalysisInput,
} from "@fabernovel/heart-common"
import { Command, InvalidArgumentError } from "commander"
import {
  AnalysisOptions,
  createExceptListenersOption,
  createConfigOption,
  createOnlyListenersOption,
  createThresholdOption,
} from "./AnalysisOption.js"

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
        validateAnalysisInput(listenerModulesIds, config, threshold, exceptListeners, onlyListeners)

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
