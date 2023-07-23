import {
  isModuleAnalysis,
  isModuleListener,
  isModuleServer,
  logger,
  type Config,
  type GenericReport,
  type ModuleAnalysisInterface,
  type ModuleIndex,
  type ModuleInterface,
  type ModuleListenerInterface,
  type ModuleServerInterface,
  type Result,
} from "@fabernovel/heart-common"
import dotenv from "dotenv"
import { readFileSync } from "node:fs"
import { cwd, env } from "node:process"
import type { PackageJson } from "type-fest"
import { MissingEnvironmentVariables } from "../error/MissingEnvironmentVariables.js"

type LoadedModules = [
  Map<string, ModuleAnalysisInterface<Config, GenericReport<Result>>>,
  Map<string, ModuleListenerInterface>,
  Map<string, ModuleServerInterface>
]

// file that contains the list of required environment variables
const PACKAGE_PREFIX = "@fabernovel/heart-"
const ENVIRONMENT_VARIABLE_TEMPLATE = ".env.tpl"
// assume that the root path is the one from where the script has been called
// /!\ this approach does not follow symlink
const ROOT_PATH = cwd()

/**
 * Load the installed modules:
 * 1. get the absolute paths of the installed Heart modules
 * 2. loads the modules
 */
export async function loadModules(debug = false): Promise<LoadedModules> {
  try {
    const modulesPaths = await getPaths(debug)

    const modules = await loadModulesFromPaths(modulesPaths, debug)

    const analysisModulesMap = new Map<string, ModuleAnalysisInterface<Config, GenericReport<Result>>>()
    const listenerModulesMap = new Map<string, ModuleListenerInterface>()
    const serverModulesMap = new Map<string, ModuleServerInterface>()

    // as modulesPaths and modules are ordered identically,
    // we could use the index to construct the Map objects
    modulesPaths.forEach((modulePath, index) => {
      const module = modules[index]

      if (isModuleAnalysis(module)) {
        analysisModulesMap.set(modulePath, module)
      } else if (isModuleListener(module)) {
        listenerModulesMap.set(modulePath, module)
      } else if (isModuleServer(module)) {
        serverModulesMap.set(modulePath, module)
      }
    })

    return [analysisModulesMap, listenerModulesMap, serverModulesMap]
  } catch (error) {
    return Promise.reject(error)
  }
}

/**
 * Load environment variables
 *
 * @returns The environment variables names that are missing
 * @throws MissingEnvironmentVariables
 */
export function loadEnvironmentVariables(modulePath: string): void {
  const missingEnvironmentVariables: string[] = []

  try {
    // load the .env.tpl file from the module
    const requiredModuleDotenvVariables = Object.entries(
      dotenv.parse(readFileSync(modulePath + ENVIRONMENT_VARIABLE_TEMPLATE, "utf8"))
    )

    // set variables if
    // not yet registered in process.env
    // and having a default value in .env.tpl file,
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

  if (missingEnvironmentVariables.length > 0) {
    throw new MissingEnvironmentVariables(missingEnvironmentVariables)
  }
}

/**
 * Retrieve the paths of @fabernovel/heart-* modules, except heart-cli and heart-common.
 * (Heart Common must not be installed as an npm package, but who knows ¯\_(ツ)_/¯)
 * paths are guessed according to the content of the package.json
 */
async function getPaths(debug = false): Promise<string[]> {
  const pattern = new RegExp(`^${PACKAGE_PREFIX}(?!cli|common)`)
  const packageJsonPath = `${ROOT_PATH}/package.json`
  const moduleIndex = (await import(packageJsonPath, { assert: { type: "json" } }).catch((error) => {
    if (debug) {
      logger.error(`package.json not found in ${ROOT_PATH}`)
    }

    return Promise.reject(error)
  })) as { default: PackageJson }
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
  const paths = modulesNames.map((moduleName: string) => `${ROOT_PATH}/node_modules/${moduleName}/`)

  if (debug) {
    paths.forEach((path: string) => {
      logger.info(`Looking for a module in ${path}`)
    })
  }

  return paths
}

/**
 * Load a list of modules according to their path.
 * Preserve the order in the returned array.
 */
async function loadModulesFromPaths(modulesPaths: string[], debug = false): Promise<ModuleInterface[]> {
  const promises = []

  // do not use the .forEach() method here instead of the for() loop,
  // because the 'await' keyword will not be available.
  for (const modulePath of modulesPaths) {
    // read package.json file from the module to look for the module entry point
    // @see {@link https://docs.npmjs.com/files/package.json#main}
    try {
      if (debug) {
        logger.info("Loading module %s...", modulePath)
      }

      const moduleIndex = (await import(`${modulePath}package.json`, {
        assert: { type: "json" },
      })) as {
        default: Omit<PackageJson, "name" | "main"> & {
          name: NonNullable<PackageJson["name"]>
          main: NonNullable<PackageJson["main"]>
        }
      }
      const packageJson = moduleIndex.default
      const { initialize } = (await import(modulePath + packageJson.main)) as ModuleIndex
      const module = initialize()

      // only keep the modules that are compatible
      if (isModuleAnalysis(module) || isModuleListener(module) || isModuleServer(module)) {
        // guess the module id from the package name: take the string after the characters "@fabernovel/heart-"
        const matches = new RegExp(`^${PACKAGE_PREFIX}(.+)$`).exec(packageJson.name)

        if (null === matches) {
          logger.error(
            `${packageJson.name} module not loaded because the name does not start with ${PACKAGE_PREFIX}.`
          )
        } else {
          module.id = matches[1]
          promises.push(module)
        }
      }
    } catch (error) {
      logger.error(error)
    }
  }

  return Promise.all(promises)
}
