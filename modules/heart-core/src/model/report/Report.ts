import ServiceInterface from '../service/ServiceInterface';

/**
 * Define an analysis report that is shared between every Heart module.
 *
 * /!\ WARNING /!\
 * Be very careful if you change the Report class structure, as it could have an impact on every Heart module.
 */
interface ReportBase {
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

}

interface ValueHolder<A> {
  /**
  * Report value
  */
  value: A;
}

export default interface Report extends ReportBase {
  /**
   * Ranking given by the service
   */
  getNote(): string;

  /**
   * Normalized ranking: a number between 0 and 100
   */
  getNormalizedNote(): number;
}

export interface ReportArguments<A> extends ReportBase, ValueHolder<A> {
}


export interface GenericReport<A> extends Report, ValueHolder<A> {
}
