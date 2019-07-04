#!/usr/bin/env node

import { ModuleAnalysisInterface, ModuleLoader } from '@fabernovel/heart-core';
import * as program from 'commander';
import { readFileSync } from 'fs';
import { isAbsolute } from 'path';

import App from './App';
import InputAnalysisValidation from './Validation/InputAnalysisValidation';

const moduleLoader = new ModuleLoader(false);

moduleLoader.load()
  .then((modules: any[]) => {
    const app = new App(modules);

    // list the allowed values of the --service option
    const serviceValues = app.analysisModules.map((module: ModuleAnalysisInterface) => {
      const analysis = new module.Analysis();

      return analysis.getRoutePath();
    });

    program.version('2.0.0');

    program
      .command('analysis')
        .description('Run an analysis using a single analysis service')
        .option('-s, --service <service>', '[Mandatory] Name of the service that will perform the analysis')
        .option('-f, --file [file]', '[Optional] Path to the JSON configuration file')
        .option('-i, --inline [inline]', '[Optional] Inlined JSON configuration')
        .action((cmd: program.Command) => {
          const errors = InputAnalysisValidation.validate(cmd.service, cmd.file, cmd.inline, serviceValues);

          if (errors.length > 0) {
            errors.forEach(error => console.error(error));
            process.exit(1);
          }

          let config = {};
          let configStr = '';

          if (cmd.inline) {
            configStr = cmd.inline;
          } else { // file: load file from the given path
            const path = isAbsolute(cmd.file) ? cmd.file : `${process.env.PWD}/${cmd.file}`;

            try {
              configStr = readFileSync(path, 'utf8');
            } catch (e) {
              console.error(e);
              process.exit(1);
            }
          }

          try {
            config = JSON.parse(configStr);
          } catch (e) {
            console.error('Cannot parse the configuration. Please check the JSON syntax.');
            process.exit(1);
          }

          app.start(cmd.service, config);
        });

    // // prepare cli for a future release, where the CLI will be a required dependency of every module,
    // // and Heart API will be launched from the CLI
    // program
    //   .command('api')
    //     .description('Set up the API')
    //     .option('-h, --host [host]', 'Specify the host')
    //     .option('-p, --port [port]', 'Specify the port', parseInt);

    program
      // print error message and --help For invalid commands
      .on('command:*', () => {
        console.error('Invalid command name.\n');
        program.help();
        process.exit(1);
      })
      .parse(process.argv);
  })
  .catch(e => {
    console.error(e);
    process.exit(1);
  });

