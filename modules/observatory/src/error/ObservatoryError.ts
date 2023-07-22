import type { ObservatoryScanState } from "@fabernovel/heart-common"

export class ObservatoryError extends Error {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(state: ObservatoryScanState) {
    super(state)
  }
}
