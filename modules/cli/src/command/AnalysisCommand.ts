import { GenericReport } from "@fabernovel/heart-common"
import { Config, ModuleAnalysisInterface, Result, validateInput } from "@fabernovel/heart-common"
import { Command } from "commander"
import { BaseOptions, createBaseSubcommand } from "./BaseCommand.js"

type AnalysisOptions = Partial<{
  file: string
  inline: string
  threshold: string
}>

type Options = BaseOptions & AnalysisOptions

// the keys are used to create the options names:
// - options long names: keys names
// - options short names: first letter of the keys names
const ANALYSIS_OPTIONS: { [key in keyof AnalysisOptions]-?: string } = {
  file: "file",
  inline: "inline",
  threshold: "threshold",
}

/**
 * Create a command dedicated to the given analysis module
 */
export const createAnalysisSubcommand = <C extends Config, R extends GenericReport<Result>>(
  module: ModuleAnalysisInterface<C, R>,
  callback: (config: C, threshold?: number) => Promise<void>
): Command => {
  const subcommand = createBaseSubcommand(module.id, `Analyzes an url with ${module.service.name}`)

  subcommand
    .option(
      `-${ANALYSIS_OPTIONS.file[0]}, --${ANALYSIS_OPTIONS.file} [${ANALYSIS_OPTIONS.file}]", "Path to the JSON configuration file`
    )
    .option(
      `-${ANALYSIS_OPTIONS.inline[0]}, --${ANALYSIS_OPTIONS.inline} [${ANALYSIS_OPTIONS.inline}]", "Inlined JSON configuration definition`
    )
    .option(
      `-${ANALYSIS_OPTIONS.threshold[0]}, --${ANALYSIS_OPTIONS.threshold} [${ANALYSIS_OPTIONS.threshold}]`,
      "A threshold between 0 and 100 that you want to reach with the analysis"
    )
    .action(async (options: Options) => {
      const { file, inline, threshold, exceptListeners, onlyListeners } = options

      console.log(exceptListeners, onlyListeners)

      const [parsedConfig, parsedThreshold] = validateInput<C>(file, inline, threshold)

      await callback(parsedConfig, parsedThreshold)
    })

  return subcommand
}
