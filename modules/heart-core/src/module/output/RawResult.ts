/**
 * JSON object that contains the raw results of an analysis.
 * Therefore, its structure is different for each analysis module.
 */
export type RawResult = {
  [key: string]: unknown
}
