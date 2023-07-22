import { writeFileSync } from "fs"
import { env } from "node:process"

const ENVIRONMENT_VARIABLE_NAME = "HEART_BIGQUERY_GOOGLE_APPLICATION_CREDENTIALS"
const FILENAME = `${ENVIRONMENT_VARIABLE_NAME.toLocaleLowerCase()}.json`

/**
 * GCloud service account authentication, using credentials from the environment variable.
 *
 * Rational: unify Heart modules configurations.
 *
 * How it works:
 * 1. Dump the credentials from the HEART_BIGQUERY_GOOGLE_APPLICATION_CREDENTIALS environment variable into a file (utf-8 encoded)
 * 2. Create the GOOGLE_APPLICATION_CREDENTIALS environment variable with the path the file
 *
 * @see {@link https://cloud.google.com/docs/authentication/getting-started}
 */
export function prepareAuthentication(): void {
  try {
    writeFileSync(FILENAME, env[ENVIRONMENT_VARIABLE_NAME] ?? "")

    env.GOOGLE_APPLICATION_CREDENTIALS = `${process.cwd()}/${FILENAME}`
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}
