import { Option } from "commander"
import type { JsonValue } from "type-fest"
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

export function createConfigOption(): Option {
  return new Option(
    `-${ANALYSIS_OPTIONS.config[0]}, --${ANALYSIS_OPTIONS.config} [${ANALYSIS_OPTIONS.config}]", "Path to the JSON configuration file`
  )
    .conflicts(ANALYSIS_OPTIONS.config)
    .argParser((path) => {
      try {
        const configStringified = readFile(path)

        return JSON.parse(configStringified) as JsonValue
      } catch (error) {
        console.error("ya un soucis coco!")
        throw error
      }
    })
}

// export function createInlineOption(): Option {
//   return new Option(
//     `-${ANALYSIS_OPTIONS.inline[0]}, --${ANALYSIS_OPTIONS.inline} [${ANALYSIS_OPTIONS.inline}]", "Inlined JSON configuration`
//   )
//     .conflicts(ANALYSIS_OPTIONS.file)
//     .argParser((value) => {
//       return JSON.parse(value) as JsonValue
//     })
// }

export function createThresholdOption(): Option {
  return new Option(
    `-${ANALYSIS_OPTIONS.threshold[0]}, --${ANALYSIS_OPTIONS.threshold} [${ANALYSIS_OPTIONS.threshold}]`,
    "A threshold between 0 and 100 that you want to reach with the analysis"
  ).argParser((value) => Number(value))
}

export function createExceptListenersOption(): Option {
  return new Option(
    `-le, --${ANALYSIS_OPTIONS.exceptListeners} <${snakeCaseToCamelCase(ANALYSIS_OPTIONS.exceptListeners)}>`,
    "A comma-separated list of listener modules that will not be triggered after the analysis is done"
  )
    .conflicts(snakeCaseToCamelCase(ANALYSIS_OPTIONS.onlyListeners))
    .argParser((value) => value.split(","))
}

export function createOnlyListenersOption(): Option {
  return new Option(
    `-lo, --${ANALYSIS_OPTIONS.onlyListeners} <${snakeCaseToCamelCase(ANALYSIS_OPTIONS.onlyListeners)}>`,
    "A comma-separated list of listener modules that will be triggered after the analysis is done"
  )
    .conflicts(snakeCaseToCamelCase(ANALYSIS_OPTIONS.exceptListeners))
    .argParser((value) => value.split(","))
}
