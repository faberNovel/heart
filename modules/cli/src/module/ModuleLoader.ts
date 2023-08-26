import { logger, type Module, type ModuleIndex, type ModuleMetadata } from "@fabernovel/heart-common"
import Ajv, { type AnySchema, type ErrorObject } from "ajv"
import AjvErrors from "ajv-errors"
import addFormats from "ajv-formats"
import { existsSync } from "node:fs"
import { env } from "node:process"
import type { PackageJson } from "type-fest"
import type { PackageJsonModule } from "./PackageJson.js"

type ModulesMetadata = [
  Map<string, PackageJsonModule>,
  Map<string, PackageJsonModule>,
  Map<string, PackageJsonModule>
]

const PACKAGE_PREFIX = "@fabernovel/heart-"

/**
 * Load the installed modules metadata:
 * 1. get the absolute paths of the installed Heart modules
 * 2. loads the package.json file
 */
export async function loadModulesMetadata(cwd: string): Promise<ModulesMetadata> {
  try {
    const modulesPaths = await getPaths(cwd)

    const modulesMetadata = await loadJSON<PackageJsonModule>(modulesPaths, "package.json")

    const analysisModulesMap = new Map<string, PackageJsonModule>()
    const listenerModulesMap = new Map<string, PackageJsonModule>()
    const serverModulesMap = new Map<string, PackageJsonModule>()

    // as modulesPaths and modules are ordered identically,
    // we could use the index to construct the Map objects
    modulesPaths.forEach((modulePath, index) => {
      const moduleMetadata = modulesMetadata[index]

      if (moduleMetadata !== undefined) {
        if (moduleMetadata.heart.type === "analysis") {
          analysisModulesMap.set(modulePath, moduleMetadata)
        } else if (
          moduleMetadata.heart.type === "listener" ||
          moduleMetadata.heart.type === "listener:database"
        ) {
          listenerModulesMap.set(modulePath, moduleMetadata)
        } else {
          // moduleMetadata.heart.type === "server
          serverModulesMap.set(modulePath, moduleMetadata)
        }
      }
    })

    return [analysisModulesMap, listenerModulesMap, serverModulesMap]
  } catch (error) {
    return Promise.reject(error)
  }
}

/**
 * Load a batch of JSON files that share the same filename but are located at different path.
 * Preserve the order in the returned array.
 * If the file does not exists, returns undefined.
 */
export async function loadJSON<T>(paths: string[], filename: string): Promise<(undefined | T)[]> {
  const promises = paths.map((path) => {
    if (existsSync(path + filename)) {
      return import(path + filename, {
        assert: { type: "json" },
      }) as Promise<{ default: T }>
    } else {
      return undefined
    }
  })

  const modules = await Promise.all(promises)

  return modules.map((module) => (module ? module.default : undefined))
}

/**
 * Check the environment variables:
 * 1. set default values
 * 2. validate the variables
 *
 * @returns The environment variables names that are missing
 */
export async function checkEnvironmentVariables(modulesPaths: string[]): Promise<void> {
  const errors = new Array<ErrorObject>()
  const ajv = new Ajv.default({ allErrors: true })
  addFormats.default(ajv)
  AjvErrors.default(ajv /*, {singleError: true} */)

  const schemas = await loadJSON<AnySchema>(modulesPaths, ".env.schema.json")

  schemas
    .filter((schema): schema is AnySchema => schema !== undefined)
    .map((schema) => {
      const validate = ajv.compile(schema)

      if (!validate(env)) {
        errors.push(...(validate.errors ?? []))
      }
    })

  if (errors.length > 0) {
    console.error(errors)
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
    logger.info(`Importing modules ${metadatas.map((metadata) => metadata.id).join(", ")}...`)
  }

  const moduleIndexes = await Promise.all(promises)

  if (verbose) {
    logger.info(`Modules ${metadatas.map((metadata) => metadata.id).join(", ")} imported.`)
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
