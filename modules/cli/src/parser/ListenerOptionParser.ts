import { ModuleListenerInterface } from "@fabernovel/heart-common"
import { InvalidArgumentError } from "commander"
import { isListenerOptionValid } from "../validation/ListenerOptionValidation.js"

export function parseListenerOption(
  value: string,
  listenerModulesIds: Array<ModuleListenerInterface["id"]>
): string[] {
  const optionValues = value.split(",")

  if (!isListenerOptionValid(listenerModulesIds, optionValues)) {
    throw new InvalidArgumentError(`Possible values: ${listenerModulesIds.join(", ")}.`)
  }

  return optionValues
}
