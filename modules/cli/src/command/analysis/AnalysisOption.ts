import { InvalidArgumentError, Option } from "commander"
import type { JsonValue } from "type-fest"
import { isErrnoException } from "../../error/ErrnoException.js"
import { readFile } from "../../filesystem/fs.js"
import { snakeCaseToCamelCase } from "../../text/case.js"

export type AnalysisOptions = { config: JsonValue } & Partial<{
  threshold: number
  exceptListeners: string[] // array of strings because of the .argParser() on the Option
  onlyListeners: string[] // array of strings because of the .argParser() on the Option
}>

// the keys are used to create the options names:
// - options long names: keys names
// - options short names: first letter of the keys names
const ANALYSIS_OPTIONS: { [key in keyof AnalysisOptions]-?: string } = {
  config: "config",
  threshold: "threshold",
  exceptListeners: "except-listeners",
  onlyListeners: "only-listeners",
}

function parseConfig(config: string): JsonValue {
  return JSON.parse(config) as JsonValue
}

/**
 * Create the required --config option.
 * Accepts either a file path to a JSON file, either an inline JSON.
 * Additional JSON schema validation is done in a dedicated validation process.
 */
export function createConfigOption(): Option {
  return new Option(
    `-${ANALYSIS_OPTIONS.config[0]}, --${ANALYSIS_OPTIONS.config} <${ANALYSIS_OPTIONS.config}>", "Path to the JSON configuration file`
  )
    .makeOptionMandatory()
    .argParser((config) => {
      try {
        const configStringified = readFile(config)

        return parseConfig(configStringified)
      } catch (error) {
        if (isErrnoException(error)) {
          // triggered if the file cannot be read (e.g. invalid path)
          try {
            return parseConfig(config)
          } catch (error) {
            throw new InvalidArgumentError(
              "The configuration is neither a file or a valid stringified JSON. Please check the file path or the JSON syntax."
            )
          }
        } else if (error instanceof SyntaxError) {
          throw new InvalidArgumentError(
            "The content of the configuration file cannot parse as JSON. Please check the syntax."
          )
        }

        throw error
      }
    })
}

/**
 * Create the optional --threshold option.
 * Accepts a number.
 * Additional JSON schema validation is done in a dedicated validation process.
 */
export function createThresholdOption(): Option {
  return new Option(
    `-${ANALYSIS_OPTIONS.threshold[0]}, --${ANALYSIS_OPTIONS.threshold} <${ANALYSIS_OPTIONS.threshold}>`,
    "A threshold between 0 and 100 that you want to reach with the analysis"
  ).argParser((value) => Number(value))
}

/**
 * Create the optional --except-listeners option.
 * Accepts a comma-separated list of string.
 * Additional JSON schema validation is done in a dedicated validation process.
 */
export function createExceptListenersOption(): Option {
  return new Option(
    `-le, --${ANALYSIS_OPTIONS.exceptListeners} <${snakeCaseToCamelCase(ANALYSIS_OPTIONS.exceptListeners)}>`,
    "A comma-separated list of listener modules that will not be triggered after the analysis is done"
  )
    .conflicts(snakeCaseToCamelCase(ANALYSIS_OPTIONS.onlyListeners))
    .argParser((value) => value.split(","))
}

/**
 * Create the optional --only-listeners option.
 * Accepts a comma-separated list of string.
 * Additional JSON schema validation is done in a dedicated validation process.
 */
export function createOnlyListenersOption(): Option {
  return new Option(
    `-lo, --${ANALYSIS_OPTIONS.onlyListeners} <${snakeCaseToCamelCase(ANALYSIS_OPTIONS.onlyListeners)}>`,
    "A comma-separated list of listener modules that will be triggered after the analysis is done"
  )
    .conflicts(snakeCaseToCamelCase(ANALYSIS_OPTIONS.exceptListeners))
    .argParser((value) => value.split(","))
}
