import { readFileSync } from "node:fs"
import { isAbsolute } from "node:path"
import { ConfigError } from "../error/ConfigError.js"
import { ListenersError } from "../error/ListenersError.js"
import { ThresholdError } from "../error/ThresholdError.js"
import { ModuleListenerInterface } from "../index.js"
import { Config } from "../module/config/Config.js"

/**
 * Validate that the analysis options are correct
 * @throws {ConfigError}
 * @throws {ThresholdError}
 * @throws {ListenersError}
 * @returns The analysis configuration and the threshold
 */
export function validateInput<C extends Config>(
  configFile: string | undefined,
  configInline: string | undefined,
  thresholdInline: string | undefined,
  listenerModules: ModuleListenerInterface[],
  exceptListeners: string[] | undefined,
  onlyListeners: string[] | undefined
): [C, number | undefined, ModuleListenerInterface[]] {
  const config = parseConfig<C>(configFile, configInline)
  const threshold = undefined === thresholdInline ? undefined : parseThreshold(thresholdInline)
  const listenerModulesFiltered = parseListenerModules(listenerModules, exceptListeners, onlyListeners)

  return [config, threshold, listenerModulesFiltered]
}

function validateListenersInput(
  listenerModulesIds: Array<ModuleListenerInterface["id"]>,
  optionValues: string[]
): boolean {
  return optionValues.every((optionValue) => listenerModulesIds.includes(optionValue))
}

function readFile(path: string): string {
  const realPath = isAbsolute(path) ? path : `${process.env.PWD as string}/${path}`

  return readFileSync(realPath, "utf8")
}

/**
 * @throws {ConfigError}
 */
function parseConfig<T>(configFile: string | undefined, configInline: string | undefined): T {
  if (undefined === configFile && undefined === configInline) {
    throw new ConfigError("You must provide a configuration.")
  } else if (undefined !== configFile && undefined !== configInline) {
    throw new ConfigError("You must provide only one configuration.")
  }

  const config = configInline ?? readFile(configFile as string)
  try {
    return JSON.parse(config) as T
  } catch (error) {
    throw new ConfigError("Cannot parse the configuration. Please check the JSON syntax.")
  }
}

/**
 * @throws {ThresholdError}
 */
function parseThreshold(threshold: string): number {
  const parsedThreshold = Number(threshold)

  if (isNaN(parsedThreshold) || parsedThreshold < 0 || parsedThreshold > 100) {
    throw new ThresholdError("The threshold must be a number between 0 and 100.")
  }

  return parsedThreshold
}

/**
 * @throws {ListenersError}
 */
function parseListenerModules(
  listenerModules: ModuleListenerInterface[],
  exceptListeners: string[] | undefined,
  onlyListeners: string[] | undefined
): ModuleListenerInterface[] {
  if (Array.isArray(exceptListeners)) {
    const listenerModulesIds = listenerModules.map((listenerModule) => listenerModule.id)
    const isListenerOptionValid = validateListenersInput(listenerModulesIds, exceptListeners)

    if (isListenerOptionValid) {
      return listenerModules.filter((listenerModule) => !exceptListeners.includes(listenerModule.id))
    } else {
      throw new ListenersError(`Possible values: ${listenerModulesIds.join(", ")}.`)
    }
  } else if (Array.isArray(onlyListeners)) {
    const listenerModulesIds = listenerModules.map((listenerModule) => listenerModule.id)
    const isListenerOptionValid = validateListenersInput(listenerModulesIds, onlyListeners)

    if (isListenerOptionValid) {
      return listenerModules.filter((listenerModules) => onlyListeners.includes(listenerModules.id))
    } else {
      throw new ListenersError(`Possible values: ${listenerModulesIds.join(", ")}.`)
    }
  } else {
    return listenerModules
  }
}
