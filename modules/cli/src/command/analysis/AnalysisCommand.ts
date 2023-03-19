import {
  Config,
  GenericReport,
  ModuleAnalysisInterface,
  ModuleListenerInterface,
  Result,
  validateInput,
} from "@fabernovel/heart-common"
import { Command } from "commander"
import {
  AnalysisOptions,
  createExceptListenersOption,
  createFileOption,
  createInlineOption,
  createOnlyListenersOption,
  createThresholdOption,
} from "./AnalysisOption.js"

/**
 * Create a command dedicated to the given analysis module
 */
export const createAnalysisSubcommand = <C extends Config, R extends GenericReport<Result>>(
  module: ModuleAnalysisInterface<C, R>,
  listenerModules: ModuleListenerInterface[],
  callback: (
    config: C,
    threshold: number | undefined,
    listenerModulesFiltered: ModuleListenerInterface[]
  ) => Promise<void>
): Command => {
  const subcommand = new Command(module.id)

  subcommand
    .description(`Analyzes a URL with ${module.service.name}`)
    .addOption(createFileOption())
    .addOption(createInlineOption())
    .addOption(createThresholdOption())
    .addOption(createExceptListenersOption())
    .addOption(createOnlyListenersOption())
    .action(async (options: AnalysisOptions) => {
      const { file, inline, threshold, exceptListeners, onlyListeners } = options

      const [parsedConfig, parsedThreshold] = validateInput<C>(file, inline, threshold)

      let listenerModulesFiltered: ModuleListenerInterface[] = []
      if (Array.isArray(exceptListeners)) {
        listenerModulesFiltered = listenerModules.filter(
          (listenerModule) => !exceptListeners.includes(listenerModule.id)
        )
      } else if (Array.isArray(onlyListeners)) {
        listenerModulesFiltered = listenerModules.filter((listenerModules) =>
          onlyListeners.includes(listenerModules.id)
        )
      } else {
        listenerModulesFiltered = listenerModules
      }

      await callback(parsedConfig, parsedThreshold, listenerModulesFiltered)
    })

  return subcommand
}
