import _Ajv, { JSONSchemaType } from "ajv"
import type { JsonValue } from "type-fest"
import { InputError, ModuleListenerInterface } from "../../index.js"
import type { ParsedInput, ValidatedInput } from "../../input/Input.js"
const Ajv = _Ajv as unknown as typeof _Ajv.default // temp workaround: https://github.com/ajv-validator/ajv/issues/2132#issuecomment-1290409907

/**
 * Validate that the analysis options are correct.
 * Throws InputError if not.
 *
 * @throws {InputError}
 */
export function validateAnalysisInput(
  config: JsonValue,
  threshold: number | undefined,
  listenerModulesIds: ModuleListenerInterface["id"][],
  exceptListenersIds: string[] | undefined,
  onlyListenersIds: string[] | undefined
): void {
  const data = createData(config, threshold, exceptListenersIds, onlyListenersIds)
  const schema = createValidationSchema(listenerModulesIds)

  const ajv = new Ajv()
  const validate = ajv.compile(schema)

  if (!validate(data)) {
    throw new InputError("Something went wrong with the input validation")
  }
}

function createData(
  config: JsonValue,
  threshold: number | undefined,
  exceptListenersIds: string[] | undefined,
  onlyListenersIds: string[] | undefined
): ParsedInput {
  return {
    config: config,
    threshold: threshold,
    except_listeners: exceptListenersIds,
    only_listeners: onlyListenersIds,
  }
}

function createValidationSchema(
  listenerModulesIds: ModuleListenerInterface["id"][]
): JSONSchemaType<ValidatedInput> {
  const s: JSONSchemaType<ValidatedInput> = {
    type: "object",
    properties: {
      config: {
        minProperties: 1,
        patternProperties: {
          "^.*$": {
            anyOf: [
              { type: "string" },
              { type: "number" },
              { type: "boolean" },
              { type: "null" },
              { $ref: "#" },
              {
                type: "array",
                items: {
                  $ref: "#",
                },
              },
            ],
          },
        },
      },
      threshold: {
        type: "number",
        minimum: 0,
        maximum: 100,
      },
      except_listeners: {
        type: "array",
        items: {
          type: "string",
          enum: listenerModulesIds,
        },
      },
      only_listeners: {
        type: "array",
        items: {
          type: "string",
          enum: listenerModulesIds,
        },
      },
    },
    required: ["config"],
    additionalProperties: false,
  }

  return s
}
