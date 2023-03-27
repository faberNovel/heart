/**
 * Define a third-party service, as used by the analysis modules for example.
 * This data is common to the Report and Module models
 */
export interface Service {
  /**
   * Example: Mozilla Observatory
   */
  readonly name: string

  /**
   * Public url to the logo
   */
  readonly logo?: string
}
