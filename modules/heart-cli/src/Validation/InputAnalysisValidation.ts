export default class InputAnalysisValidation {
  /**
   * @returns A list of error message
   */
  public static validate(service: string, configFile: string, configInline: string, serviceAllowedValues: string[]): string[] {
    const errors: string[] = [];

    // create the RegExp that will be used to check valid values from the service variable.
    // RegExp format: ^(serviceValue1|serviceValue2)$
    // 1. escape routePaths for a usage in RegExp (@see https://stackoverflow.com/a/6969486)
    // 2. create the RegExp
    const serviceValues = serviceAllowedValues.map((routePath: string) => routePath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const servicePattern = new RegExp('^(' + serviceValues.join('|') + ')$');

    if (undefined === service) {
      errors.push(`You must specify a service amongst these ${serviceAllowedValues.length}: ${serviceAllowedValues.join (', ')}`);
    } else if ('string' === typeof service && !service.match(servicePattern)) {
      errors.push(`Unknown service. Available ones: ${serviceAllowedValues.join (', ')}`);
    }

    if (undefined === configFile && undefined === configInline) {
      errors.push(`You must specify the service configuration`);
    } else if (undefined !== configFile && undefined !== configInline) {
      errors.push(`You must specify only one service configuration`);
    }

    return errors;
  }
}
