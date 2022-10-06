/**
 * Representation of an analysis service in BigQuery
 */
export class RecordThreshold {
  public value?: number
  public isReached?: boolean

  constructor(value?: number, isReached?: boolean) {
    this.value = value
    this.isReached = isReached
  }
}
