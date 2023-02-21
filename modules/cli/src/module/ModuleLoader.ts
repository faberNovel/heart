import {
  isModuleAnalysis,
  isModuleListener,
  isModuleServer,
  ModuleIndex,
  ModuleInterface,
} from "@fabernovel/heart-common"
import dotenv from "dotenv"
import { readFileSync } from "node:fs"
import { cwd, env } from "node:process"
import { PackageJson } from "type-fest"
import { MissingEnvironmentVariables } from "../error/MissingEnvironmentVariables.js"

// file that contains the list of required environment variables
const PACKAGE_PREFIX = "@fabernovel/heart-"
const ENVIRONMENT_VARIABLE_MODEL = ".env.sample"
// assume that the root path is the one from where the script has been called
// /!\ this approach does not follow symlink
const ROOT_PATH = cwd()

/**
 * Load the installed modules:
 * 1. get the absolute paths of the installed Heart modules
 * 2. loads the modules
 */
export async function load(debug = false): Promise<Map<string, ModuleInterface>> {
  try {
    const modulesPaths = await getPaths(debug)

    const modules = await loadModules(modulesPaths, debug)

    // as modulesPaths and modules are ordered identically, we could use the index to construct the Map()
    return new Map(modulesPaths.map((modulePath, i) => [modulePath, modules[i]]))
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
    // load the .env.sample file from the module
    const requiredModuleDotenvVariables = Object.entries(
      dotenv.parse(readFileSync(modulePath + ENVIRONMENT_VARIABLE_MODEL, "utf8"))
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
      console.error(`package.json not found in ${ROOT_PATH}`)
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
  const paths = modulesNames.map((moduleName: string) => `${ROOT_PATH}/node_modules/${moduleName}/`)

  if (debug) {
    paths.forEach((path: string) => console.log(`Looking for a module in ${path}`))
  }

  return paths
}

/**
 * Load a list of modules according to their path.
 * Preserve the order in the returned array.
 */
async function loadModules(modulesPaths: string[], debug = false): Promise<ModuleInterface[]> {
  const promises = []

  // do not use the .forEach() method here instead of the for() loop,
  // because the 'await' keyword will not be available.
  for (let i = 0; i < modulesPaths.length; i++) {
    const modulePath = modulesPaths[i]

    // read package.json file from the module to look for the module entry point
    // @see {@link https://docs.npmjs.com/files/package.json#main}
    try {
      if (debug) {
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
        const matches = new RegExp(`^${PACKAGE_PREFIX}(.+)$`).exec(packageJson.name)

        if (null === matches) {
          console.error(
            `${packageJson.name} module not loaded because the name does not start with ${PACKAGE_PREFIX}.`
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
