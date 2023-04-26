import type { ErrorObject } from "ajv"

export class InputError extends Error {
  cause: ErrorObject[] = []

  constructor(errors: ErrorObject[]) {
    super("Something went wrong with the input validation")

    // using the ErroOptions.cause does not change the cause property, so we are doing like that
    this.cause = errors

    // @see {@link https://github.com/Microsoft/TypeScript-wiki/blob/main/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work}
    Object.setPrototypeOf(this, InputError.prototype)
  }
}
