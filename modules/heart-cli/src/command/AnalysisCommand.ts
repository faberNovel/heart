import { Config, ModuleAnalysisInterface, ThresholdInputObject } from '@fabernovel/heart-core';
import { Command, CommanderStatic } from 'commander';
import {AnalysisOptionsValidation} from '../validation/AnalysisOptionsValidation';

export class AnalysisCommand {
  /**
   * Create a command dedicated to the given analysis module
   */
  public static create<T extends Config>(
    program: CommanderStatic,
    module: ModuleAnalysisInterface<T>,
    callback: (config: T, threshold?: ThresholdInputObject) => void
  ): void {
    program
      .command(module.id)
      .description(`Analyzes an url with ${module.service.name}`)
      .option('-f, --file [file]', 'Path to the JSON configuration file')
      .option('-i, --inline [inline]', 'Inlined JSON configuration definition')
      .option('-t, --threshold-file [file]', 'Path to the JSON threshold file')
      .option('-l, --threshold-inline [inline]', 'Inlined JSON threshold definition')
      .action((cmd: Command) => {
        try {
          const [config, threshold] = AnalysisOptionsValidation.validate<T>(
            cmd.file,
            cmd.inline,
            cmd.thresholdFile,
            cmd.thresholdInline
          );

          callback(config, threshold);
        } catch (error) {
          console.error(error);
          cmd.help();
        }
      });

  }
}
