import type { AnySchema, JSONSchemaType } from "ajv"
import type { ValidatedAnalysisInput } from "../../../index.js"
import type { ModuleListenerInterface } from "../../../module/ModuleListenerInterface.js"
import { validateInput } from "../InputValidation.js"
import configSchema from "./schema/config.json" assert { type: "json" }
import thresholdSchema from "./schema/threshold.json" assert { type: "json" }

function getValidationSchema(listenerModulesIds: ModuleListenerInterface["id"][]): AnySchema {
  const listenerSchema: JSONSchemaType<ModuleListenerInterface["id"][]> = {
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
      // defining a JSON schema that is valid against the JsonObject type from the type-fest dependency
      // is quite a challenge, and may not be even possible with constraints like having a minimum of 1 property.
      // for these reasons, we are using the AnySchema type instead of an ideal JSONSchemaType<JsonObject>.
      config: configSchema as AnySchema,
      threshold: thresholdSchema as JSONSchemaType<number>,
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
      },
    ],
    required: ["config"],
    additionalProperties: false,
    // customize error messages with ajv-errors
    errorMessage: {
      properties: {
        config: "config must an object with at least 1 property",
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
