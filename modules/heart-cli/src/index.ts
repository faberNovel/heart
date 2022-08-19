#!/usr/bin/env node

import { isModuleAnalysis, isModuleServer, ModuleInterface, ThresholdInputObject } from '@fabernovel/heart-core';
import * as program from 'commander';

import {AnalysisCommand} from './command/AnalysisCommand';
import {ServerCommand} from './command/ServerCommand';
import {ModuleLoader} from './module/ModuleLoader';
import {App} from './App';

// set environment variables from a.env file
// assume that the root path if the one from where the script has been called
// /!\ this approach does not follow symlink
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({path: `${process.cwd()}/.env`});

const moduleLoader = new ModuleLoader(false);

moduleLoader.load()
  .catch (error => {
    console.error(error);
    process.exit(1);
  })
  .then((modules: ModuleInterface[]) => {
    const app = new App(modules);

    program.version('3.0.0');

    // create a command for each module
    modules.forEach((module: ModuleInterface) => {
      if (isModuleAnalysis(module)) {
        AnalysisCommand.create(program, module, (conf: object, threshold?: ThresholdInputObject) => app.startAnalysis(module, conf, threshold));
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
  });
