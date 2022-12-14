import { ServiceInterface } from "../service/ServiceInterface"

export interface ReportInterface {
  /**
   * URL that is analyzed
   */
  analyzedUrl: string

  /**
   * Date of the analyze.
   * Could be different from the moment when the analysis is done, because some services have a cache system.
   */
  date: Date

  /**
   * Ranking given by the service
   */
  note: string

  /**
   * Normalized ranking: a number between 0 and 100
   */
  normalizedNote: number

  /**
   * URL where the analysis results are accessible
   */
  resultUrl?: string

  /**
   * Details about the service that process the analysis
   */
  service: ServiceInterface

  /**
   * Threshold
   */
  threshold?: number

  isThresholdReached(): boolean | undefined
}
