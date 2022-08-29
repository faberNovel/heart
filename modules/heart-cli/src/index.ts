#!/usr/bin/env node

import { Config, isModuleAnalysis, isModuleServer, ModuleInterface, ThresholdInputObject } from '@fabernovel/heart-core';
import { Command } from 'commander'
import * as dotenv from 'dotenv'
import {AnalysisCommand} from './command/AnalysisCommand';
import {ServerCommand} from './command/ServerCommand';
import {ModuleLoader} from './module/ModuleLoader';
import {App} from './App';

// set environment variables from a.env file
// assume that the root path if the one from where the script has been called
// /!\ this approach does not follow symlink
// eslint-disable-next-line @typescript-eslint/no-var-requires
dotenv.config({ path: `${process.cwd()}/.env` })

const moduleLoader = new ModuleLoader(false);

moduleLoader.load()
  .then((modules: ModuleInterface[]) => {
    const app = new App(modules);

    const program = new Command()
    program.version('3.0.0');

    // create a command for each module
    modules.forEach((module: ModuleInterface) => {
      if (isModuleAnalysis(module)) {
        AnalysisCommand.create(program, module, <T extends Config>(conf: T, threshold?: ThresholdInputObject) => app.startAnalysis(module, conf, threshold));
      } else if (isModuleServer(module)) {
        ServerCommand.create(program, module, (port: number) => app.startServer(module, modules, port));
      }
    });

    program
      // print error message and --help For invalid commands
      .on('command:*', () => {
        console.error('Invalid command name.\n');
        program.help();
      })
      .parse(process.argv);
  })
  .catch (error => {
    console.error(error);
    process.exit(1);
  });
