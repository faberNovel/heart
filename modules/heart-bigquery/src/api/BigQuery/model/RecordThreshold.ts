/**
 * Representation of an analysis service in BigQuery
 */
export class RecordThreshold {
  public areThresholdsReached?: boolean;

  constructor(areThresholdsReached?: boolean) {
    this.areThresholdsReached = areThresholdsReached;
  }
}
