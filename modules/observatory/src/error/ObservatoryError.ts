import type { ObservatoryScanState } from "@fabernovel/heart-common"

export class ObservatoryError extends Error {
  constructor(state: ObservatoryScanState) {
    super(state)
  }
}
