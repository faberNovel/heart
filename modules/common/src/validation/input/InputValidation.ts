import _Ajv, { AnySchema } from "ajv"
import { InputError } from "../../error/InputError.js"
const Ajv = _Ajv as unknown as typeof _Ajv.default // temp workaround: https://github.com/ajv-validator/ajv/issues/2132#issuecomment-1290409907

/**
 * Validate that the analysis options are correct.
 * Throws InputError if not.
 *
 * @throws {InputError}
 */
export function validateInput<ValidatedType>(data: unknown, schema: AnySchema): ValidatedType {
  const ajv = new Ajv()
  const validate = ajv.compile(schema)

  if (!validate(data)) {
    console.error(validate, validate.errors)
    throw new InputError("Something went wrong with the input validation")
  }

  return data as ValidatedType
}
