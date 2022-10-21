type JsonError = {
  error: string
}

export const createJsonError = (message: string): JsonError => ({
  error: message,
})
