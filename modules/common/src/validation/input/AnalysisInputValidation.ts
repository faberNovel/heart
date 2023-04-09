import _Ajv, { AnySchema, JSONSchemaType } from "ajv"
import type { JsonValue } from "type-fest"
import { InputError, ModuleListenerInterface } from "../../index.js"
import configSchema from "./schema/config.json" assert { type: "json" }
import thresholdSchema from "./schema/threshold.json" assert { type: "json" }
const Ajv = _Ajv as unknown as typeof _Ajv.default // temp workaround: https://github.com/ajv-validator/ajv/issues/2132#issuecomment-1290409907

function createData(
  config: JsonValue,
  threshold: number | undefined,
  exceptListenersIds: string[] | undefined,
  onlyListenersIds: string[] | undefined
) {
  return {
    config: config,
    threshold: threshold,
    except_listeners: exceptListenersIds,
    only_listeners: onlyListenersIds,
  }
}

/**
 * Validate that the analysis options are correct.
 * Throws InputError if not.
 *
 * @throws {InputError}
 */
export function validateAnalysisInput(
  listenerModulesIds: ModuleListenerInterface["id"][],
  config: JsonValue,
  threshold: number | undefined,
  exceptListenersIds: string[] | undefined,
  onlyListenersIds: string[] | undefined
): void {
  const data = createData(config, threshold, exceptListenersIds, onlyListenersIds)
  const schema = createValidationSchema(listenerModulesIds)

  const ajv = new Ajv()
  const validate = ajv.compile(schema)

  if (!validate(data)) {
    // console.error(validate.errors)
    throw new InputError("Something went wrong with the input validation")
  }
}

/**
 * Create a JSON schema to validate inputs against.
 */
export function createValidationSchema(listenerModulesIds: ModuleListenerInterface["id"][]): AnySchema {
  const listenerSchema: JSONSchemaType<ModuleListenerInterface["id"][]> = {
    type: "array",
    items: {
      type: "string",
      pattern: listenerModulesIds.join("|"),
    },
  }

  return {
    $schema: "http://json-schema.org/draft-07/schema",
    type: "object",
    properties: {
      config: configSchema as AnySchema,
      threshold: thresholdSchema as JSONSchemaType<number>,
      except_listeners: listenerSchema,
      only_listeners: listenerSchema,
    },
    required: ["config"],
    additionalProperties: false,
  }
}
