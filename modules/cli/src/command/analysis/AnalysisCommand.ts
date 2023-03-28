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
        const [validatedConfig, validatedThreshold, listenerModulesFiltered] = validateAnalysisInput<C>(
          file,
          inline,
          threshold,
          listenerModules,
          exceptListeners,
          onlyListeners
        )

        await callback(validatedConfig, validatedThreshold, listenerModulesFiltered)
      } catch (error) {
        if (error instanceof InputError) {
          throw new InvalidArgumentError(error.message)
        }
      }
    })

  return subcommand
}
