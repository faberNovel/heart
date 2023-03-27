import { InputError } from "../InputError.js"

export class ConfigInputError extends InputError {
  constructor(message?: string) {
    super(message)
  }
}
