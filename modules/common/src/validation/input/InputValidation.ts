import Ajv, { type AnySchema } from "ajv"
import AjvErrors from "ajv-errors"
import { InputError } from "../../error/InputError.js"

/**
 * Validate that the analysis options are correct.
 * Throws InputError if not.
 *
 * @throws {InputError}
 */
export function validateInput<ValidatedType>(data: unknown, schema: AnySchema): ValidatedType {
  const ajv = new Ajv.default({ allErrors: true })
  AjvErrors.default(ajv /*, {singleError: true} */)
  const validate = ajv.compile(schema)

  if (!validate(data)) {
    throw new InputError(validate.errors ?? [])
  }

  return data as ValidatedType
}
