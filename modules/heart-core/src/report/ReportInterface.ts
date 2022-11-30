import { RawResult } from "../module/output/RawResult"
import { Service } from "../service/Service"

export interface ReportInterface<R extends RawResult> {
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
  rawResults: R

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
  service: Service

  /**
   * Threshold
   */
  threshold?: number

  isThresholdReached(): boolean | undefined
}
