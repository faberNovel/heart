import { ModuleListenerInterface } from "@fabernovel/heart-common"

export function isListenerOptionValid(
  listenerModulesIds: Array<ModuleListenerInterface["id"]>,
  optionValues: string[]
): boolean {
  return optionValues.every((optionValue) => listenerModulesIds.includes(optionValue))
}
