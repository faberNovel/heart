export type Error = {
  error: unknown
  text: string
}

export const isError = (object: unknown): object is Error => (object as Error).error !== undefined
