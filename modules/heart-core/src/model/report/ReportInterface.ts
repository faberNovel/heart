import { RawResults } from "../result/RawResults"
import { ServiceInterface } from "../service/ServiceInterface"

export interface ReportInterface<T extends RawResults> {
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
   * Raw results send back by the analysis modules
   */
  rawResults: T

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
