import ServiceInterface from '../service/ServiceInterface';
import { ThresholdInputObject, ThresholdOutputObject } from '../threshold/ReportThresholdObject';

import Report from './Report';

export default interface ReportInterface {
  /**
   * URL that is analyzed
   */
  analyzedUrl: string;

  /**
   * Date of the analyze.
   * Could be different from the moment when the analysis is done, because some services have a cache system.
   */
  date: Date;

  /**
   * Ranking given by the service
   */
  note: string;

  /**
   * Normalized ranking: a number between 0 and 100
   */
  normalizedNote: number;

  /**
   * URL where the analysis results are accessible
   */
  resultUrl?: string;

  /**
   * Details about the service that process the analysis
   * Optional because some Heart modules do not sollicitate a third-party service (Heart API for example)
   */
  service?: ServiceInterface;

  /**
   * Copy of the threshold input object
   */
  thresholds?: ThresholdInputObject;

  /**
   * Detailed summary of the threshold validation for each condition specified in the input thresholds object
   */
  thresholdsResults?: ThresholdOutputObject;

  /**
   * Status indicating if analysis report satisfies the conditions defined by the thresholds
   */
  areThresholdsReached?: boolean;
}
