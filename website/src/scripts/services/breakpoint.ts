import { Breakpoint } from '../models/breakpoint';

export const BreakpointService = {
  getFromWindow: () => window.innerWidth > Breakpoint.MOBILE ? Breakpoint.DESKTOP : Breakpoint.MOBILE
}
