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
    let config = undefined;
    let threshold = undefined;

    if (undefined === configFile && undefined === configInline) {
      throw new Error('You must provide a configuration');
    } else if (undefined !== configFile && undefined !== configInline) {
      throw new Error('You must provide only one configuration');
    }

    if (undefined !== thresholdFile && undefined !== thresholdInline) {
      throw new Error('You must provide only one threshold input');
    }

    if (configInline) {
      config = configInline;
    } else if (undefined !== configFile) {
      // file: load file from the given path
      const path = isAbsolute(configFile)
        ? configFile
        : `${process.env.PWD}/${configFile}`;

      config = readFileSync(path, 'utf8');
    }

    if (undefined !== thresholdInline) {
      threshold = thresholdInline;
    } else if (undefined !== thresholdFile) {
      const path = isAbsolute(thresholdFile)
        ? thresholdFile
        : `${process.env.PWD}/${thresholdFile}`;

      threshold = readFileSync(path, 'utf8');
    }

    try {
      config = JSON.parse(config as string);
    } catch (error) {
      throw new Error('Cannot parse the configuration. Please check the JSON syntax.');
    }

    if (undefined !== threshold) {
      try {
        threshold = JSON.parse(threshold);
      } catch (error) {
        throw new Error('Cannot parse the threshold. Please check the JSON syntax.');
      }
    }

    return [config, threshold];
  }
}
