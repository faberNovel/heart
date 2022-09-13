import { Slider } from "./components/slider"
import { BreakpointService } from "./services/breakpoint"
import { DataService } from "./services/data"

window.addEventListener("DOMContentLoaded", () => {
  const data = DataService.getInstance()
  data.currentBreakpoint = BreakpointService.getFromWindow()

  // Init sliders
  data.sliders = Slider.initAll(data.currentBreakpoint)

  // On resize
  window.addEventListener("resize", () => {
    const breakpointFromWindow = BreakpointService.getFromWindow()

    // Update slider if breakpoint has changed
    //   - mobile: init event listeners
    //   - desktop: stop event listeners
    if (data.currentBreakpoint !== breakpointFromWindow) {
      Slider.update(data.sliders, breakpointFromWindow)
    }

    // Reset slider on first element if screen is resized
    Slider.resetTrackScrollAll(data.sliders)

    data.currentBreakpoint = BreakpointService.getFromWindow()
  })
})
