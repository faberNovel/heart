/**
 * @see [Documentation]{@link https://github.com/ssllabs/ssllabs-scan/blob/master/ssllabs-api-docs-v3.md#error-reporting}
 */
export type Error = {
    errors: {
        field: string
        message: string
    }[]
}

export const isError = (object: unknown): object is Error => Array.isArray(object['errors']) 