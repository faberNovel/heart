import { logger, type Module, type ModuleIndex, type ModuleMetadata } from "@fabernovel/heart-common"
import dotenv from "dotenv"
import { readFileSync } from "node:fs"
import { env } from "node:process"
import type { PackageJson } from "type-fest"
import { MissingEnvironmentVariables } from "../error/MissingEnvironmentVariables.js"
import type { PackageJsonModule } from "./PackageJson.js"

type ModulesMetadata = [
  Map<string, PackageJsonModule>,
  Map<string, PackageJsonModule>,
  Map<string, PackageJsonModule>
]

// file that contains the list of required environment variables
const PACKAGE_PREFIX = "@fabernovel/heart-"
const ENVIRONMENT_VARIABLE_TEMPLATE = ".env.tpl"

/**
 * Load the installed modules metadata:
 * 1. get the absolute paths of the installed Heart modules
 * 2. loads the package.json file
 */
export async function loadModulesMetadata(cwd: string): Promise<ModulesMetadata> {
  try {
    const modulesPaths = await getPaths(cwd)

    const modulesMetadata = await loadModulesMetadataFromPath(modulesPaths)

    const analysisModulesMap = new Map<string, PackageJsonModule>()
    const listenerModulesMap = new Map<string, PackageJsonModule>()
    const serverModulesMap = new Map<string, PackageJsonModule>()

    // as modulesPaths and modules are ordered identically,
    // we could use the index to construct the Map objects
    modulesPaths.forEach((modulePath, index) => {
      const moduleMetadata = modulesMetadata[index]

      if (moduleMetadata.heart.type === "analysis") {
        analysisModulesMap.set(modulePath, moduleMetadata)
      } else if (moduleMetadata.heart.type === "listener") {
        listenerModulesMap.set(modulePath, moduleMetadata)
      } else if (moduleMetadata.heart.type === "server") {
        serverModulesMap.set(modulePath, moduleMetadata)
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

export async function initializeModules<M extends Module>(
  listenerModulesMap: Map<string, PackageJsonModule>,
  verbose: boolean
): Promise<M[]> {
  const paths = new Array<string>()
  const metadatas = new Array<ModuleMetadata>()

  listenerModulesMap.forEach((packageJsonModule, modulePath) => {
    paths.push(modulePath + packageJsonModule.main)
    metadatas.push(packageJsonModule.heart)
  })

  const promises = paths.map((path) => import(path) as Promise<ModuleIndex>)

  if (verbose) {
    logger.info(`Loading modules ${metadatas.map((metadata) => metadata.id).join(", ")}...`)
  }

  const moduleIndexes = await Promise.all(promises)

  if (verbose) {
    logger.info(`Modules ${metadatas.map((metadata) => metadata.id).join(", ")} loaded.`)
  }

  // as Promise.all() keeps the order, the arrays paths, metadatas, promises and modules have all the exact same indexation
  return moduleIndexes.map((moduleIndex, i) => moduleIndex.initialize(metadatas[i], verbose) as M)
}

/**
 * Retrieve the paths of @fabernovel/heart-* modules, except heart-cli and heart-common.
 * (Heart Common must not be installed as an npm package, but who knows ¯\_(ツ)_/¯)
 * paths are guessed according to the content of the package.json
 */
async function getPaths(cwd: string): Promise<string[]> {
  const pattern = new RegExp(`^${PACKAGE_PREFIX}(?!cli|common)`)
  const packageJsonPath = `${cwd}/package.json`
  const moduleIndex = (await import(packageJsonPath, { assert: { type: "json" } }).catch((error) => {
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
  const paths = modulesNames.map((moduleName: string) => `${cwd}/node_modules/${moduleName}/`)

  return paths
}

/**
 * Load the modules metadata (the ones inside the package.json's heart key).
 * Preserve the order in the returned array.
 */
async function loadModulesMetadataFromPath(modulesPaths: string[]): Promise<PackageJsonModule[]> {
  const promises = modulesPaths.map(
    (modulePath) =>
      import(`${modulePath}package.json`, {
        assert: { type: "json" },
      }) as Promise<{ default: PackageJsonModule }>
  )

  const modules = await Promise.all(promises)

  return modules.map((module) => module.default)
}
