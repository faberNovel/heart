import { InputError } from "../InputError.js"

export class ThresholdInputError extends InputError {
  constructor(message?: string) {
    super(message)
  }
}
