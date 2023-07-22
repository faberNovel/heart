import type { ObservatoryScanState } from "@fabernovel/heart-common"

export class ObservatoryError extends Error {
  constructor(state: ObservatoryScanState) {
    super(state)

    // @see {@link https://github.com/Microsoft/TypeScript-wiki/blob/main/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work}
    Object.setPrototypeOf(this, ObservatoryError.prototype)
  }
}
