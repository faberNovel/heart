import type { ErrorObject } from "ajv"

export class EnvironmentError extends Error {
  constructor(errors: ErrorObject[]) {
    super(
      "Something is wrong with your environment variables:" +
        errors.map((error) => "\n- " + (error.message ?? ""))
    )

    // @see {@link https://github.com/Microsoft/TypeScript-wiki/blob/main/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work}
    Object.setPrototypeOf(this, EnvironmentError.prototype)
  }
}
