import { readFile } from "../../filesystem/fs.js"
import {
  ConfigInputError,
  ListenersInputError,
  ModuleListenerInterface,
  ThresholdInputError,
} from "../../index.js"
import type { Config } from "../../module/config/Config.js"

/**
 * Validate that the analysis options are correct
 * @throws {ConfigError}
 * @throws {ThresholdError}
 * @throws {ListenersError}
 * @returns The analysis configuration and the threshold
 */
export function validateAnalysisInput<C extends Config>(
  configFile: string | undefined,
  configInline: string | undefined,
  threshold: string | undefined,
  listenerModules: ModuleListenerInterface[],
  exceptListeners: string[] | undefined,
  onlyListeners: string[] | undefined
): [C, number | undefined, ModuleListenerInterface[]] {
  const validatedConfig = parseConfig<C>(configFile, configInline)
  const validatedThreshold = undefined === threshold ? undefined : parseThreshold(threshold)
  const listenerModulesFiltered = parseListenerModules(listenerModules, exceptListeners, onlyListeners)

  return [validatedConfig, validatedThreshold, listenerModulesFiltered]
}

function validateListenersInput(
  listenerModulesIds: ModuleListenerInterface["id"][],
  optionValues: string[]
): boolean {
  return optionValues.every((optionValue) => listenerModulesIds.includes(optionValue))
}

/**
 * @throws {ConfigInputError}
 */
function parseConfig<T>(configFile: string | undefined, configInline: string | undefined): T {
  if (undefined === configFile && undefined === configInline) {
    throw new ConfigInputError("You must provide a configuration.")
  }

  let config: string
  if (configInline) {
    config = configInline
  } else {
    try {
      config = readFile(configFile as string)
    } catch (error) {
      throw new ConfigInputError(`Cannot read file ${configFile as string}.`)
    }
  }

  try {
    return JSON.parse(config) as T
  } catch (error) {
    throw new ConfigInputError("Cannot parse the configuration. Please check the JSON syntax.")
  }
}

/**
 * @throws {ThresholdInputError}
 */
function parseThreshold(threshold: string): number {
  const parsedThreshold = Number(threshold)

  if (isNaN(parsedThreshold) || parsedThreshold < 0 || parsedThreshold > 100) {
    throw new ThresholdInputError("The threshold must be a number between 0 and 100.")
  }

  return parsedThreshold
}

/**
 * Parse the listeners options
 *
 * @param listenerModulesLoaded Listener modules loaded
 * @param exceptListeners Unwanted listeners ids from the listenerModulesLoaded list
 * @param onlyListeners Only listeners ids from the listenerModulesLoaded list
 *
 * @throws {ListenersError}
 * @returns Listener modules filtered, according to the exceptListener and onlyListeners rules
 */
function parseListenerModules(
  listenerModulesLoaded: ModuleListenerInterface[],
  exceptListeners: string[] | undefined,
  onlyListeners: string[] | undefined
): ModuleListenerInterface[] {
  if (Array.isArray(exceptListeners)) {
    const listenerModulesIds = listenerModulesLoaded.map((listenerModule) => listenerModule.id)
    const isListenerOptionValid = validateListenersInput(listenerModulesIds, exceptListeners)

    if (isListenerOptionValid) {
      return listenerModulesLoaded.filter((listenerModule) => !exceptListeners.includes(listenerModule.id))
    } else {
      throw new ListenersInputError(`Possible values: ${listenerModulesIds.join(", ")}.`)
    }
  } else if (Array.isArray(onlyListeners)) {
    const listenerModulesIds = listenerModulesLoaded.map((listenerModule) => listenerModule.id)
    const isListenerOptionValid = validateListenersInput(listenerModulesIds, onlyListeners)

    if (isListenerOptionValid) {
      return listenerModulesLoaded.filter((listenerModules) => onlyListeners.includes(listenerModules.id))
    } else {
      throw new ListenersInputError(`Possible values: ${listenerModulesIds.join(", ")}.`)
    }
  } else {
    return listenerModulesLoaded
  }
}
