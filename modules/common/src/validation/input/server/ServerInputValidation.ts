import type { AnySchema } from "ajv"
import type { ValidatedServerInput } from "../../../input/ServerInput.js"
import { validateInput } from "../InputValidation.js"
import corsSchema from "./schema/cors.json" assert { type: "json" }
import portSchema from "./schema/port.json" assert { type: "json" }

function getValidationSchema(): AnySchema {
  return {
    $schema: "http://json-schema.org/draft-07/schema",
    type: "object",
    properties: {
      port: portSchema as AnySchema,
      cors: corsSchema as AnySchema,
    },
    additionalProperties: false,
  }
}

/**
 * Validate that the server options are correct.
 * Throws InputError if not.
 *
 * @throws {InputError}
 */
export function validateServerInput(data: unknown): ValidatedServerInput {
  const schema = getValidationSchema()

  return validateInput<ValidatedServerInput>(data, schema)
}
