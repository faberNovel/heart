#! /usr/bin/env node

import { ModuleAnalysisInterface, ModuleLoader } from '@fabernovel/heart-core';
import * as program from 'commander';

import App from './App';

const moduleLoader = new ModuleLoader(false);

moduleLoader.load()
  .then((modules: any[]) => {
    const app = new App(modules);

    // list the commands that will be available in the CLI, according to the loaded modules.
    // for now, the only available commands are the one related to analysis modules.
    const commands = app.analysisModules.map((module: ModuleAnalysisInterface) => {
      const analysis = new module.Analysis();

      return analysis.getRoutePath();
    });

    // set the program version
    program.version('1.0.0');

    // define CLI commands
    commands.forEach((command: string) => {
      program
        .command([command, '<conf>'].join(' '))
        .action((conf: string) => app.start(command, JSON.parse(conf)));
    });

    // Print error message and --help For invalid commands
    program.on('command:*', () => {
      console.error('Invalid command name.\n');
      program.help();
      process.exit(1);
    });

    program.parse(process.argv);
  })
  .catch((e: Error) => {
    console.error(e.message);
    process.exit(1);
  });

