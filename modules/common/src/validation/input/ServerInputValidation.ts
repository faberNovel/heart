import { PortInputError } from "../../error/input/PortInputError.js"

const PORT_REGEX =
  /^(0|[1-9][0-9]{0,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/

/**
 * Validate that the server options are correct.
 * Throws InputError if not.
 *
 * @throws PortInputError
 */
export function validateServerInput(port: number): void {
  validatePort(port)
}

/**
 * @throws PortInputError
 */
function validatePort(port: number): void {
  if (!PORT_REGEX.test(port.toString())) {
    throw new PortInputError("Must be a number >= 0 and <= 65535")
  }
}
