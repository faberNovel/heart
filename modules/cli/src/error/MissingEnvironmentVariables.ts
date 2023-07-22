export class MissingEnvironmentVariables extends Error {
  constructor(missingVariables: string[]) {
    const variables = missingVariables.join(", ")
    const message =
      missingVariables.length > 1
        ? `${variables} variables are missing from your environment variables.`
        : `${variables} variable is missing from your environment variables.`
    super(message)

    // @see {@link https://github.com/Microsoft/TypeScript-wiki/blob/main/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work}
    Object.setPrototypeOf(this, MissingEnvironmentVariables.prototype)
  }
}
