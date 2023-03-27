import { InputError } from "../InputError.js"

export class ListenersInputError extends InputError {
  constructor(message?: string) {
    super(message)
  }
}
