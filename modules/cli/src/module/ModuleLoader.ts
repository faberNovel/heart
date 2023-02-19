import {
  isModuleAnalysis,
  isModuleListener,
  isModuleServer,
  ModuleIndex,
  ModuleInterface,
} from "@fabernovel/heart-common"
import * as dotenv from "dotenv"
import { readFileSync } from "node:fs"
import { cwd, env } from "node:process"
import { PackageJson } from "type-fest"
import { MissingEnvironmentVariables } from "../error/MissingEnvironmentVariables.js"

export class ModuleLoader {
  // file that contains the list of required environment variables
  private readonly ENVIRONMENT_VARIABLE_MODEL = ".env.sample"
  private readonly PACKAGE_PREFIX = "@fabernovel/heart-"
  // assume that the root path is the one from where the script has been called
  // /!\ this approach does not follow symlink
  private readonly ROOT_PATH = cwd()
  private readonly debug: boolean

  constructor(debug = false) {
    this.debug = debug
  }

  /**
   * Load the installed Heart modules:
   * 1. get the absolute paths of the installed Heart modules
   * 2. checks that no environment variables is missing
   * 3. loads the modules
   */
  public async load(): Promise<ModuleInterface[]> {
    try {
      // retrieve the paths of @fabernovel/heart-* modules, except heart-cli and heart-common.
      // (Heart Common must not be installed as an npm package, but who knows ¯\_(ツ)_/¯)
      // paths are guessed according to the content of the package.json
      const modulesPaths = await this.getPaths(
        new RegExp(`^${this.PACKAGE_PREFIX}(?!cli|common)`),
        `${this.ROOT_PATH}/package.json`
      )

      if (modulesPaths.length > 0) {
        if (this.debug) {
          console.log("Checking missing environment variables...")
        }

        // check if environment variables are missing,
        // according to the .env.sample of the loaded modules
        const missingEnvironmentVariables = this.loadEnvironmentVariables(modulesPaths)

        if (missingEnvironmentVariables.length > 0) {
          throw new MissingEnvironmentVariables(missingEnvironmentVariables)
        }
      }

      return this.loadModules(modulesPaths)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  /**
   * Load environment variables for the given loaded modules.
   *
   * @returns The environment variables names that are missing
   */
  private loadEnvironmentVariables(modulesPaths: string[]): string[] {
    const missingEnvironmentVariables: string[] = []

    modulesPaths.forEach((modulePath: string) => {
      try {
        // load the .env.sample file from the module
        const requiredModuleDotenvVariables = Object.entries(
          dotenv.parse(readFileSync(modulePath + this.ENVIRONMENT_VARIABLE_MODEL, "utf8"))
        )

        // set variables if
        // not yet registered in process.env
        // and having a default value in .env.sample file,
        requiredModuleDotenvVariables.forEach(([variableName, defaultValue]) => {
          if (!env[variableName] && defaultValue.length !== 0) {
            env[variableName] = defaultValue
          }
        })

        // get the environment variables names that are not registered in process.env
        const missingModuleEnvironmentVariables = requiredModuleDotenvVariables
          .filter(([variableName]) => !env[variableName])
          .map(([variableName]) => variableName)

        // add the missing module dotenv variables to the missing list
        missingEnvironmentVariables.push(...missingModuleEnvironmentVariables)
        // eslint-disable-next-line no-empty
      } catch (error) {}
    })

    return missingEnvironmentVariables
  }

  /**
   * List the Heart modules root path, according to the modules defined in package.json that follows the given pattern.
   */
  private async getPaths(pattern: RegExp, packageJsonPath: string): Promise<string[]> {
    const moduleIndex = (await import(packageJsonPath, { assert: { type: "json" } }).catch((error) => {
      if (this.debug) {
        console.error(`package.json not found in ${this.ROOT_PATH}`)
      }

      throw error
    })) as ModuleIndex<PackageJson>
    const packageJson = moduleIndex.default

    // list the modules according to the given pattern
    // look into the 'dependencies' and 'devDependencies' keys
    const modulesNames: string[] = []

    if (undefined !== packageJson.dependencies) {
      Object.keys(packageJson.dependencies)
        // add the module name to the list if it is not already there and matches the pattern
        .filter((moduleName) => -1 === modulesNames.indexOf(moduleName) && pattern.test(moduleName))
        .forEach((moduleName: string) => {
          modulesNames.push(moduleName)
        })
    }
    if (undefined !== packageJson.devDependencies) {
      Object.keys(packageJson.devDependencies)
        // add the module name to the list if it is not already there and matches the pattern
        .filter((moduleName) => -1 === modulesNames.indexOf(moduleName) && pattern.test(moduleName))
        .forEach((moduleName: string) => {
          modulesNames.push(moduleName)
        })
    }

    // list the absolute path of each modules
    const paths = modulesNames.map((moduleName: string) => `${this.ROOT_PATH}/node_modules/${moduleName}/`)

    if (this.debug) {
      paths.forEach((path: string) => console.log(`Looking for a module in ${path}`))
    }

    return paths
  }

  /**
   * Load a list of modules according to their path.
   */
  private async loadModules(modulesPaths: string[]): Promise<ModuleInterface[]> {
    const promises = []

    // do not use the .forEach() method here instead of the for() loop,
    // because the 'await' keyword will not be available.
    for (let i = 0; i < modulesPaths.length; i++) {
      const modulePath = modulesPaths[i]

      // read package.json file from the module to look for the module entry point
      // @see {@link https://docs.npmjs.com/files/package.json#main}
      try {
        if (this.debug) {
          console.log("Loading module %s...", modulePath)
        }

        const moduleIndex = (await import(`${modulePath}package.json`, {
          assert: { type: "json" },
        })) as ModuleIndex<
          Omit<PackageJson, "name" | "main"> & {
            name: NonNullable<PackageJson["name"]>
            main: NonNullable<PackageJson["main"]>
          }
        >
        const packageJson = moduleIndex.default
        const pkg = (await import(modulePath + packageJson.main)) as ModuleIndex<ModuleInterface>
        const module = pkg.default

        // only keep the modules that are compatible
        if (isModuleAnalysis(module) || isModuleListener(module) || isModuleServer(module)) {
          // guess the module id from the package name: take the string after the characters "@fabernovel/heart-"
          const matches = new RegExp(`^${this.PACKAGE_PREFIX}(.+)$`).exec(packageJson.name)

          if (null === matches) {
            console.error(
              `${packageJson.name} module not loaded because the name does not start with ${this.PACKAGE_PREFIX}.`
            )
          } else {
            module.id = matches[1]
            promises.push(module)
          }
        }
      } catch (error) {
        console.error(error)
      }
    }

    return Promise.all(promises)
  }
}
