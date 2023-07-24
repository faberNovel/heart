import type { SchemaObject } from "ajv"
import type { ModuleMetadata, ValidatedAnalysisInput } from "../../../index.js"
import { validateInput } from "../InputValidation.js"
import configSchema from "./schema/config.json" assert { type: "json" }
import thresholdSchema from "./schema/threshold.json" assert { type: "json" }
import verboseSchema from "../schema/verbose.json" assert { type: "json" }

export function getAnalysisValidationSchema(listenerModulesIds: ModuleMetadata["id"][]): SchemaObject {
  const listenerSchema = {
    type: "array",
    items: {
      type: "string",
      pattern: "^" + listenerModulesIds.join("|") + "$",
    },
  }

  return {
    type: "object",
    properties: {
      config: configSchema,
      threshold: thresholdSchema,
      except_listeners: listenerSchema,
      only_listeners: listenerSchema,
      verbose: verboseSchema,
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
  listenerModulesIds: ModuleMetadata["id"][] = []
): ValidatedAnalysisInput {
  const schema = getAnalysisValidationSchema(listenerModulesIds)

  return validateInput<ValidatedAnalysisInput>(data, schema)
}
