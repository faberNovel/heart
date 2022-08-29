import { Config, ModuleAnalysisInterface, ThresholdInputObject } from '@fabernovel/heart-core';
import { Command } from 'commander';
import {AnalysisOptionsValidation} from '../validation/AnalysisOptionsValidation';

type Options = Partial<{
  file: string,
  inline: string,
  thresholdFile: string,
  thresholdInline: string
}>

export class AnalysisCommand {
  /**
   * Create a command dedicated to the given analysis module
   */
  public static create<T extends Config>(
    program: Command,
    module: ModuleAnalysisInterface<T>,
    callback: (config: T, threshold?: ThresholdInputObject) => Promise<void>
  ): void {
    program
      .command(module.id)
      .description(`Analyzes an url with ${module.service.name}`)
      .option('-f, --file [file]', 'Path to the JSON configuration file')
      .option('-i, --inline [inline]', 'Inlined JSON configuration definition')
      .option('-t, --threshold-file [file]', 'Path to the JSON threshold file')
      .option('-l, --threshold-inline [inline]', 'Inlined JSON threshold definition')
      .action((options: Options) => {
        const { file, inline, thresholdFile, thresholdInline } = options

        try {
          const [config, threshold] = AnalysisOptionsValidation.validate<T>(
            file,
            inline,
            thresholdFile,
            thresholdInline
          );

          void callback(config, threshold);
        } catch (error) {
          console.error(error);
          program.help();
        }
      });
  }
}
