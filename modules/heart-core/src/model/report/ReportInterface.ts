import ServiceInterface from '../service/ServiceInterface';

export interface ReportArguments<A> {
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
  * URL where the analysis results are accessible
  */
  resultUrl?: string;

  /**
  * Details about the service that process the analysis
  * Optional because some Heart modules do not sollicitate a third-party service (Heart API for example)
  */
  service: ServiceInterface;

  /**
  * Report value
  */
  value: A;
}

export default interface ReportInterface<A> extends ReportArguments<A> {
  /**
   * Ranking given by the service
   */
  getNote(): string;

  /**
  * Normalized ranking: a number between 0 and 100
  */
  getNormalizedNote(): number;
}
