import type {
  Config,
  GenericReport,
  ModuleAnalysisInterface,
  ModuleListenerInterface,
  Result,
} from "@fabernovel/heart-common"
import { InputError, validateInput } from "@fabernovel/heart-common"
import { Command, InvalidArgumentError } from "commander"
import type { AnalysisOptions } from "./AnalysisOption.js"
import {
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
  analysisModule: ModuleAnalysisInterface<C, R>,
  listenerModules: ModuleListenerInterface[],
  callback: (
    config: C,
    threshold: number | undefined,
    listenerModulesFiltered: ModuleListenerInterface[]
  ) => Promise<void>
): Command => {
  const subcommand = new Command(analysisModule.id)

  subcommand
    .description(`Analyzes a URL with ${analysisModule.service.name}`)
    .addOption(createFileOption())
    .addOption(createInlineOption())
    .addOption(createThresholdOption())
    .addOption(createExceptListenersOption())
    .addOption(createOnlyListenersOption())
    .action(async (options: AnalysisOptions) => {
      const { file, inline, threshold, exceptListeners, onlyListeners } = options

      try {
        const [parsedConfig, parsedThreshold, listenerModulesFiltered] = validateInput<C>(
          file,
          inline,
          threshold,
          listenerModules,
          exceptListeners,
          onlyListeners
        )

        await callback(parsedConfig, parsedThreshold, listenerModulesFiltered)
      } catch (error) {
        if (error instanceof InputError) {
          throw new InvalidArgumentError(error.message)
        }
      }
    })

  return subcommand
}
