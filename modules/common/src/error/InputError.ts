export abstract class InputError extends Error {
  constructor(message?: string) {
    super(message)
  }
}
