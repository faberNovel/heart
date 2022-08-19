import { ThresholdInputObject } from '@fabernovel/heart-core';
import { readFileSync } from 'fs';
import { isAbsolute } from 'path';

export class AnalysisOptionsValidation {
  /**
   * Validate that the analysis options are correct
   * @returns The analysis configuration and the threshold
   */
  public static validate(
    configFile?: string,
    configInline?: string,
    thresholdFile?: string,
    thresholdInline?: string
  ): [object, ThresholdInputObject?] {
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
    } else {
      // file: load file from the given path
      const path = isAbsolute(configFile)
        ? configFile
        : `${process.env.PWD}/${configFile}`;

      try {
        config = readFileSync(path, 'utf8');
      } catch (error) {
        throw new Error(error.message);
      }
    }

    if (undefined !== thresholdInline) {
      threshold = thresholdInline;
    } else if (undefined !== thresholdFile) {
      const path = isAbsolute(thresholdFile)
        ? thresholdFile
        : `${process.env.PWD}/${thresholdFile}`;

      try {
        threshold = readFileSync(path, 'utf8');
      } catch (error) {
        throw new Error(error.message);
      }
    }

    try {
      config = JSON.parse(config);
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
