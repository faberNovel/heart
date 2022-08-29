import { Config, ThresholdInputObject } from '@fabernovel/heart-core';
import { readFileSync } from 'fs';
import { isAbsolute } from 'path';

export class AnalysisOptionsValidation {
  /**
   * Validate that the analysis options are correct
   * @returns The analysis configuration and the threshold
   */
  public static validate<T extends Config>(
    configFile?: string,
    configInline?: string,
    thresholdFile?: string,
    thresholdInline?: string
  ): [T, ThresholdInputObject?] {
    if (undefined === configFile && undefined === configInline) {
      throw new Error('You must provide a configuration');
    } else if (undefined !== configFile && undefined !== configInline) {
      throw new Error('You must provide only one configuration');
    }

    if (undefined !== thresholdFile && undefined !== thresholdInline) {
      throw new Error('You must provide only one threshold input');
    }

    try {
      let config: T;
      let threshold: ThresholdInputObject | undefined = undefined;

      if (undefined !== configInline) {
        config = JSON.parse(configInline) as T;
      } else { // TypeScript cannot infer that configFile is a string at this point, so we need an assertion
        config = JSON.parse(AnalysisOptionsValidation.readFile(configFile as string)) as T
      }

      if (undefined !== thresholdInline) {
        threshold = JSON.parse(thresholdInline) as ThresholdInputObject;
      } else if (undefined !== thresholdFile) {
        threshold = JSON.parse(AnalysisOptionsValidation.readFile(thresholdFile)) as ThresholdInputObject
      }

      return [config, threshold];
    } catch (error) {
      throw new Error('Cannot parse the configuration. Please check the JSON syntax.');
    }
  }

  private static readFile(path: string): string {
    const realPath = isAbsolute(path) ? path : `${process.env.PWD as string}/${path}`;

    return readFileSync(realPath, 'utf8');
  }
}
