import { Command, Option } from "commander"
import { snakeCaseToCamelCase } from "../text/case.js"

export type BaseOptions = Partial<{
  exceptListeners: string
  onlyListeners: string
}>

// the keys are used to create the options names:
// - options long names: keys names
// - options short names: first letter of the keys names
const BASE_OPTIONS: { [key in keyof BaseOptions]-?: string } = {
  exceptListeners: "except-listeners",
  onlyListeners: "only-listeners",
}

function createExceptListenersOption(): Option {
  return new Option(
    `-le, --${BASE_OPTIONS.exceptListeners} <${snakeCaseToCamelCase(BASE_OPTIONS.exceptListeners)}>`,
    "A comma-separated list of listener modules that will not be triggered after the analysis is done"
  ).conflicts(snakeCaseToCamelCase(BASE_OPTIONS.onlyListeners))
}

function createOnlyListenersOption(): Option {
  return new Option(
    `-lo, --${BASE_OPTIONS.onlyListeners} <${snakeCaseToCamelCase(BASE_OPTIONS.onlyListeners)}>`,
    "A comma-separated list of listener modules that will be triggered after the analysis is done"
  ).conflicts(snakeCaseToCamelCase(BASE_OPTIONS.exceptListeners))
}

export function createBaseSubcommand(name: string, description: string): Command {
  const cmd = new Command(name)

  const exceptListenersOption = createExceptListenersOption()
  const onlyListenersOption = createOnlyListenersOption()

  cmd.description(description).addOption(exceptListenersOption).addOption(onlyListenersOption)

  return cmd
}
