import { GenericReport } from "@fabernovel/heart-common"
import { Config, ModuleAnalysisInterface, Result, validateInput } from "@fabernovel/heart-common"
import { Command } from "commander"

type Options = Partial<{
  file: string
  inline: string
  threshold: string
}>

/**
 * Create a command dedicated to the given analysis module
 */
export const createAnalysisCommand = <C extends Config, R extends GenericReport<Result>>(
  module: ModuleAnalysisInterface<C, R>,
  callback: (config: C, threshold?: number) => Promise<void>
): Command => {
  const command = new Command(module.id)

  command
    .description(`Analyzes an url with ${module.service.name}`)
    .option("-f, --file [file]", "Path to the JSON configuration file")
    .option("-i, --inline [inline]", "Inlined JSON configuration definition")
    .option(
      "-t, --threshold [threshold]",
      "A threshold between 0 and 100 that you want to reach with the analysis"
    )
    .action(async (options: Options) => {
      const { file, inline, threshold } = options

      const [parsedConfig, parsedThreshold] = validateInput<C>(file, inline, threshold)

      await callback(parsedConfig, parsedThreshold)
    })

  return command
}
