import { Config, ModuleAnalysisInterface } from "@fabernovel/heart-core"
import { Command } from "commander"
import { AnalysisOptionsValidation } from "../validation/AnalysisOptionsValidation"

type Options = Partial<{
  file: string
  inline: string
  threshold: string
}>

export class AnalysisCommand {
  /**
   * Create a command dedicated to the given analysis module
   */
  public static create<T extends Config>(
    program: Command,
    module: ModuleAnalysisInterface<T>,
    callback: (config: T, threshold?: number) => Promise<void>
  ): void {
    program
      .command(module.id)
      .description(`Analyzes an url with ${module.service.name}`)
      .option("-f, --file [file]", "Path to the JSON configuration file")
      .option("-i, --inline [inline]", "Inlined JSON configuration definition")
      .option(
        "-t, --threshold [threshold]",
        "A threshold between 0 and 100 that your want to reach with the analysis"
      )
      .action((options: Options) => {
        const { file, inline, threshold } = options

        try {
          const [parsedConfig, parsedThreshold] = AnalysisOptionsValidation.validate<T>(
            file,
            inline,
            threshold
          )

          void callback(parsedConfig, parsedThreshold)
        } catch (error) {
          console.error(error)
          program.help()
        }
      })
  }
}
