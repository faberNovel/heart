import { Result } from "../module/analysis/output/Result.js"
import { Service } from "../service/Service.js"

export interface ReportInterface<R extends Result> {
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
   * Result send back by the analysis modules.
   * These data are raw and untouched yet.
   */
  result: R

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

  displayNote(): string

  isThresholdReached(): boolean | undefined
}
