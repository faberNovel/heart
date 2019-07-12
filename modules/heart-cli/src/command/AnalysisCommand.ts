import { ModuleAnalysisInterface } from '@fabernovel/heart-core';
import { Command, CommanderStatic } from 'commander';

import AnalysisOptionsValidation from '../validation/AnalysisOptionsValidation';

export default class AnalysisCommand {
  /**
   * Create an command dedicated to the given analysis module
   */
  public static create(program: CommanderStatic, module: ModuleAnalysisInterface, callback: (config: object) => void): void {
    program
      .command(module.id)
      .description(`Analyzes an url with ${module.service.name}`)
      .option('-f, --file [file]', 'Path to the JSON configuration file')
      .option('-i, --inline [inline]', 'Inlined JSON configuration')
      .action((cmd: Command) => {
        const [errors, config] = AnalysisOptionsValidation.validate(cmd.file, cmd.inline);

        if (errors.length > 0) {
          errors.forEach(error => console.error(error));
          cmd.help();
        }

        try {
          callback(JSON.parse(config));
        } catch (error) {
          console.error('Cannot parse the configuration. Please check the JSON syntax.');
          process.exit(1);
        }
      });
  }
}
