export interface ScanError {
  error: unknown
  text: string
}

export const isScanError = (object: unknown): object is ScanError => (object as ScanError).error !== undefined
