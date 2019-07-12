import { writeFileSync } from 'fs';

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
export default class Authentication {
  private static readonly ENVIRONMENT_VARIABLE_NAME = 'GOOGLE_APPLICATION_CREDENTIALS';
  private static readonly FILENAME = `${Authentication.ENVIRONMENT_VARIABLE_NAME.toLocaleLowerCase()}.json`;

  /**
   * 1. Dump the credentials located into the environment variable into a file (utf-8 encoded)
   * 2. Replace the environment variable content by the newly created file path
   */
  public static prepare(): void {
    try {
      writeFileSync(Authentication.FILENAME, process.env[Authentication.ENVIRONMENT_VARIABLE_NAME]);

      process.env[Authentication.ENVIRONMENT_VARIABLE_NAME] = `${process.cwd()}/${Authentication.FILENAME}`;
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  }
}
