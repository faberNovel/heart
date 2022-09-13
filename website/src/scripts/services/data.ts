import { Breakpoint } from "../models/breakpoint"
import { Slider } from "../components/slider"

export class DataService {
  private static instance: DataService

  #sliders: Slider[] = []
  #currentBreakpoint: Breakpoint

  /**
   * The static method that controls the access to the DataService instance (singleton).
   *
   * This implementation let you subclass the DataService class while keeping
   * just one instance of each subclass around.
   */
  public static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService()
    }

    return DataService.instance
  }

  get currentBreakpoint(): Breakpoint {
    return this.#currentBreakpoint
  }

  set currentBreakpoint(breakpoint: Breakpoint) {
    this.#currentBreakpoint = breakpoint
  }

  get sliders(): Slider[] {
    return this.#sliders
  }

  set sliders(sliders: Slider[]) {
    this.#sliders = sliders
  }
}
