import type { SchemaObject } from "ajv"
import type { ValidatedAnalysisInput } from "../../../index.js"
import type { ModuleListenerInterface } from "../../../module/ModuleListenerInterface.js"
import { validateInput } from "../InputValidation.js"
import configSchema from "./schema/config.json" assert { type: "json" }
import thresholdSchema from "./schema/threshold.json" assert { type: "json" }

function getValidationSchema(listenerModulesIds: ModuleListenerInterface["id"][]): SchemaObject {
  const listenerSchema = {
    type: "array",
    items: {
      type: "string",
      pattern: "^" + listenerModulesIds.join("|") + "$",
    },
  }

  return {
    $schema: "http://json-schema.org/draft-07/schema",
    type: "object",
    properties: {
      config: configSchema,
      threshold: thresholdSchema,
      except_listeners: listenerSchema,
      only_listeners: listenerSchema,
    },
    allOf: [
      // make the listener options mutually exclusive
      {
        not: {
          type: "object",
          required: ["except_listeners", "only_listeners"],
        },
        errorMessage: "The except-listeners and only-listeners options cannot be used simultaneously",
      },
    ],
    required: ["config"],
    additionalProperties: false,
    // customize error messages with ajv-errors
    errorMessage: {
      properties: {
        config: "config must be an object with at least 1 property",
        except_listeners: `except-listeners must be a comma-separated list with at least one of the following values: ${listenerModulesIds.join(
          ","
        )}`,
        only_listeners: `only-listeners must be a comma-separated list with at least one of the following values: ${listenerModulesIds.join(
          ","
        )}`,
        threshold: "threshold should be a number between 0 and 100",
      },
    },
  }
}

/**
 * Validate that the analysis options are correct.
 * Throws InputError if not.
 *
 * @throws {InputError}
 */
export function validateAnalysisInput(
  data: unknown,
  listenerModulesIds: ModuleListenerInterface["id"][] = []
): ValidatedAnalysisInput {
  const schema = getValidationSchema(listenerModulesIds)

  return validateInput<ValidatedAnalysisInput>(data, schema)
}
