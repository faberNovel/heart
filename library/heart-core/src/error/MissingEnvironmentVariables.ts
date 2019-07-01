export default class MissingEnvironmentVariables extends Error {
  constructor(missingVariables: string[]) {
    const variables = missingVariables.join(', ');
    const message = missingVariables.length > 1
      ? `${variables} variables are missing from your environment variables.`
      : `${variables} variable is missing from your environment variables.`
    ;

    super(message);
    this.name = 'MissingEnvironmentVariables';
  }
}
