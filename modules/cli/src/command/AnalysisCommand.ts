import {
  Config,
  GenericReport,
  ModuleAnalysisInterface,
  ModuleListenerInterface,
  Result,
  validateInput,
} from "@fabernovel/heart-common"
import { Command, Option } from "commander"
import { snakeCaseToCamelCase } from "../text/case.js"
import { parseListenerOption } from "../parser/ListenerOptionParser.js"

type AnalysisOptions = Partial<{
  file: string
  inline: string
  threshold: string
  exceptListeners: string[] // array of strings because of the .argParser() on the Option
  onlyListeners: string[] // array of strings because of the .argParser() on the Option
}>

// the keys are used to create the options names:
// - options long names: keys names
// - options short names: first letter of the keys names
const ANALYSIS_OPTIONS: { [key in keyof AnalysisOptions]-?: string } = {
  file: "file",
  inline: "inline",
  threshold: "threshold",
  exceptListeners: "except-listeners",
  onlyListeners: "only-listeners",
}

function createExceptListenersOption(listenerModulesIds: Array<ModuleListenerInterface["id"]>): Option {
  return new Option(
    `-le, --${ANALYSIS_OPTIONS.exceptListeners} <${snakeCaseToCamelCase(ANALYSIS_OPTIONS.exceptListeners)}>`,
    "A comma-separated list of listener modules that will not be triggered after the analysis is done"
  )
    .conflicts(snakeCaseToCamelCase(ANALYSIS_OPTIONS.onlyListeners))
    .argParser((value) => parseListenerOption(value, listenerModulesIds))
}

function createOnlyListenersOption(listenerModulesIds: Array<ModuleListenerInterface["id"]>): Option {
  return new Option(
    `-lo, --${ANALYSIS_OPTIONS.onlyListeners} <${snakeCaseToCamelCase(ANALYSIS_OPTIONS.onlyListeners)}>`,
    "A comma-separated list of listener modules that will be triggered after the analysis is done"
  )
    .conflicts(snakeCaseToCamelCase(ANALYSIS_OPTIONS.exceptListeners))
    .argParser((value) => parseListenerOption(value, listenerModulesIds))
}

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
  const listenerModulesIds = listenerModules.map((listenerModule) => listenerModule.id)
  const subcommand = new Command(module.id)

  const exceptListenersOption = createExceptListenersOption(listenerModulesIds)
  const onlyListenersOption = createOnlyListenersOption(listenerModulesIds)

  subcommand
    .description(`Analyzes a URL with ${module.service.name}`)
    .option(
      `-${ANALYSIS_OPTIONS.file[0]}, --${ANALYSIS_OPTIONS.file} [${ANALYSIS_OPTIONS.file}]", "Path to the JSON configuration file`
    )
    .option(
      `-${ANALYSIS_OPTIONS.inline[0]}, --${ANALYSIS_OPTIONS.inline} [${ANALYSIS_OPTIONS.inline}]", "Inlined JSON configuration`
    )
    .option(
      `-${ANALYSIS_OPTIONS.threshold[0]}, --${ANALYSIS_OPTIONS.threshold} [${ANALYSIS_OPTIONS.threshold}]`,
      "A threshold between 0 and 100 that you want to reach with the analysis"
    )
    .addOption(exceptListenersOption)
    .addOption(onlyListenersOption)
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
