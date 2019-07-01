import * as rootPath from 'app-root-path';
import * as dotenv from 'dotenv';
import fs = require('fs');

import MissingEnvironmentVariables from '../error/MissingEnvironmentVariables';
import isModuleAnalysis from '../module/analysis/ModuleAnalysisGuard';
import isModuleNotification from '../module/notification/ModuleNotificationGuard';
import isModuleStorage from '../module/storage/ModuleStorageGuard';

export default class ModuleLoader {
  private debug: boolean;

  constructor(debug = false) {
    this.debug = debug;
  }

  /**
   * Dynamically load heart-* module(s)
   */
  public async load(): Promise<any[]> {
    try {
      // retrieve the paths of @fabernovel/heart-* modules, except heart-core and heart-server.
      // (heart-server must not be installed as an npm package, but who knows ¯\_(ツ)_/¯)
      // paths are guessed according to the content of the package.json
      const modulesPaths = await this.getPaths(/^@fabernovel\/heart-(?!cli|core|server)/, `${rootPath}/package.json`);

      if (modulesPaths.length > 0) {
        if (this.debug) {
          console.log('Checking missing environment variables...');
        }

        // check if environment variables are missing,
        // according to the .env.sample of the loaded modules
        const missingDotEnvVariables = this.getMissingEnvironmentVariables(modulesPaths, '.env.sample');

        if (missingDotEnvVariables.length > 0) {
          throw new MissingEnvironmentVariables(missingDotEnvVariables);
        }
      }

      return this.loadModules(modulesPaths);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  /**
   * Checks variables set in the 'fileName' file from the given loaded modules,
   * and returns the ones that are missing from the environment (process.env) variables.
   */
  private getMissingEnvironmentVariables(modulesPaths: string[], fileName: string): string[] {
    let missingDotEnvVariables = [];

    modulesPaths.forEach((modulePath: string) => {
      try {
        // load the .env.sample file from the module
        const requiredModuleDotenvVariables = Object.keys(dotenv.parse(fs.readFileSync(modulePath + fileName, 'utf8')));

        // get the dotenv variables that are not yet registered in process.env
        const missingModuleDotEnvVariables = requiredModuleDotenvVariables.filter((variable: string) => {
          return !process.env.hasOwnProperty(variable);
        });

        // add the missing module dotenv variables to the missing list
        missingDotEnvVariables = missingDotEnvVariables.concat(missingModuleDotEnvVariables);
      } catch (e) {}
    });

    return missingDotEnvVariables;
  }

  /**
   * List the heart-* modules root path, according to the modules defined in package.json that follows the given pattern.
   */
  private async getPaths(pattern: RegExp, packageJsonPath: string): Promise<string[]> {
    let paths = [];

    try {
      // read package.json from this module (heart-server)
      const packageJson = await import(packageJsonPath);

      // list the modules according to the given pattern
      const modulesNames = Object.keys(packageJson.dependencies).filter((moduleName: string) => {
        return pattern.test(moduleName);
      });

      paths = modulesNames.map((moduleName: string) => {
        return `${rootPath}/node_modules/${moduleName}/`;
      });

      return Promise.resolve(paths);
    } catch (e) {
      return Promise.reject(paths);
    }
  }

  /**
   * Load a list of modules according to their path.
   */
  private async loadModules(modulesPaths: string[]): Promise<any> {
    const promises = [];

    // do not use the .forEach() method here instead of the for() loop,
    // because the 'await' keyword will not be available.
    for (let i = 0 ; i < modulesPaths.length ; i++) {
      const modulePath = modulesPaths[i];

      // read package.json file from the module to look for the module entry point
      // @see {@link https://docs.npmjs.com/files/package.json#main}
      try {
        if (this.debug) {
          console.log('Loading module %s...', modulePath);
        }

        const packageJson = await import(`${modulePath}package.json`);
        const module = await import(modulePath + packageJson.main);

        // only keep the modules that are compatible
        if (isModuleAnalysis(module) || isModuleNotification(module) || isModuleStorage(module)) {
          promises.push(module);
        }
      } catch (e) {
        Promise.reject(e);
      }
    }

    return Promise.all(promises);
  }
}
