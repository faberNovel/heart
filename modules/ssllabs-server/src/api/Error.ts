/**
 * @see [Documentation]{@link https://github.com/ssllabs/ssllabs-scan/blob/master/ssllabs-api-docs-v3.md#error-reporting}
 */
export interface SsllabsServerError {
  errors: {
    field: string
    message: string
  }[]
}

export const isSsllabsServerError = (object: unknown): object is SsllabsServerError =>
  Array.isArray((object as SsllabsServerError).errors)
