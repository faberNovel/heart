export type Error = {
    error: unknown
    text: string
}

export const isError = (object: unknown): object is Error => object['error'] !== undefined