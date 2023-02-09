import { readFileSync } from "fs"
import { isAbsolute } from "path"
import { ConfigError } from "../error/ConfigError"
import { ThresholdError } from "../error/ThresholdError"
import { Config } from "../module/analysis/input/Config"

/**
 * Validate that the analysis options are correct
 * @throws {ConfigError}
 * @throws {ThresholdError}
 * @returns The analysis configuration and the threshold
 */
function validateInput<C extends Config>(
  configFile?: string,
  configInline?: string,
  thresholdInline?: string
): [C, number?] {
  const config = parseConfig<C>(configFile, configInline)
  const threshold = undefined === thresholdInline ? undefined : parseThreshold(thresholdInline)

  return [config, threshold]
}

function readFile(path: string): string {
  const realPath = isAbsolute(path) ? path : `${process.env.PWD as string}/${path}`

  return readFileSync(realPath, "utf8")
}

/**
 * @throws {ConfigError}
 */
function parseConfig<T>(configFile?: string, configInline?: string): T {
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

export { validateInput }
