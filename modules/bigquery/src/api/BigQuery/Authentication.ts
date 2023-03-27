import { writeFileSync } from "fs"
import { env } from "node:process"

const ENVIRONMENT_VARIABLE_NAME = "GOOGLE_APPLICATION_CREDENTIALS"
const FILENAME = `${ENVIRONMENT_VARIABLE_NAME.toLocaleLowerCase()}.json`

/**
 * GCloud service account authentication, using credentials from the environment variable.
 *
 * Rational: unify Heart modules configurations.
 *
 * How it works:
 * 1. Dump the credentials from the GOOGLE_APPLICATION_CREDENTIALS environment variable into a file (utf-8 encoded)
 * 2. Replace the GOOGLE_APPLICATION_CREDENTIALS environment variable content by the newly created file path
 *
 * @see {@link https://cloud.google.com/docs/authentication/getting-started}
 */
export function prepareAuthentication(): void {
  try {
    writeFileSync(FILENAME, env[ENVIRONMENT_VARIABLE_NAME] as string)

    process.env[ENVIRONMENT_VARIABLE_NAME] = `${process.cwd()}/${FILENAME}`
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}
