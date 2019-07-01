/**
 * Representation of an analysis service in BigQuery
 */
export default class RecordRanking {
  public original: string;
  public normalized: number;

  constructor(original: string, normalized: number) {
    this.original = original;
    this.normalized = normalized;
  }
}
