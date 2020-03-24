import { Breakpoint } from '../models/breakpoint';

export class Slider {
  // Attributes
  private static readonly ATTR_DATA_INDEX = 'data-index';
  // Classes
  private static readonly CLASS_IS_ACTIVE = '-isActive';
  private static readonly CLASS_REMOVE_DOTS = '-removeDots';
  // Selectors
  private static readonly SELECTOR = '.slider';
  private static readonly SELECTOR_SLIDE = `${Slider.SELECTOR}__slide`;
  private static readonly SELECTOR_DOTS_WRAP = `${Slider.SELECTOR}__dotsWrap`;
  private static readonly SELECTOR_DOTS_LI = `${Slider.SELECTOR_DOTS_WRAP} > li`;
  private static readonly SELECTOR_TRACK = `${Slider.SELECTOR}__track`;

  #currentIndex: number; // current index of active slide (from 0)
  #dotsLi: NodeListOf<HTMLElement> // list of li element with SELECTOR_DOTS_LI class name
  #track: HTMLElement; // HTML element which contains all slides
  #scrollEventCallback: Function; // use because bind(this) changed the function signature: https://stackoverflow.com/a/22870717
  #slides: NodeListOf<HTMLElement>; // list of HTML element with SELECTOR_SLIDE class name
  #ticking = false; // 

  /**
   * @param element HTMLElement with SELECTOR class name
   */
  constructor(element: HTMLElement) {
    this.#dotsLi = element.querySelectorAll(Slider.SELECTOR_DOTS_LI);
    this.#scrollEventCallback = this.scrollEventCallback.bind(this);
    this.#slides = element.querySelectorAll(Slider.SELECTOR_SLIDE);
    this.#track = element.querySelector(Slider.SELECTOR_TRACK);
    this.activeSlide(0);
  }

  /**
   * Create Slider instances for all .slider node
   */
  static initAll(breakpoint: Breakpoint): Slider[] {
    let instances = [];

    document.querySelectorAll(Slider.SELECTOR).forEach((element: HTMLElement) =>
      instances.push(new Slider(element))
    );

    Slider.update(instances, breakpoint);

    return instances;
  }

  static resetTrackScrollAll(sliders: Slider[]): void {
    sliders.forEach((slider) => slider.resetTrackScroll());
  }

  /**
   * If breakpoint is:
   *   - mobile: init event listeners
   *   - desktop: stop event listeners
   */
  static update(sliders: Slider[], breakpoint: Breakpoint): void {
    if (breakpoint === Breakpoint.MOBILE) {
      sliders.forEach(slider => slider.addScrollEvent())
    } else {
      sliders.forEach(slider => slider.removeScrollEvent())
    }
  }

  /**
   * When slide is visible:
   *   - add -isActive class on new active dot
   *   - remove -isActive class on old active dot
   * @param index
   */
  private activeSlide(index: number): void {
    const currentDotA = this.#dotsLi.item(this.#currentIndex).firstElementChild
    const newActiveDotA = this.#dotsLi.item(index).firstElementChild;

    currentDotA?.classList.remove(Slider.CLASS_IS_ACTIVE);
    newActiveDotA.classList.add(Slider.CLASS_IS_ACTIVE);

    this.#currentIndex = index;
  }

  /**
   * Add scroll event to find active slide
   */
  private addScrollEvent(): void {
    this.#track.addEventListener('scroll', this.#scrollEventCallback);
  }

  /**
   * Get index of current slide
   * If we see two slides, we take the most visible one (throught halfOfSlide variable)
   *
   * @param scrollLeft number of pixels that an scroll container is scrolled from its left edge
   * @param scrollWidth width of scroll container
   */
  private findIndex(scrollLeft: number, scrollWidth: number): number {
    const slideWidth = scrollWidth / this.#slides.length;
    const halfOfSlide = slideWidth / 2;

    return Math.floor((scrollLeft + halfOfSlide) / slideWidth);
  }

  private removeScrollEvent(): void {
    this.#track.removeEventListener('scroll', this.#scrollEventCallback);
    this.#ticking = false;
  }

  /**
   * Reset slider to first position (first slider becomes active) 
   *  to prevent display bug at resize 
   */
  private resetTrackScroll(): void {
    this.#track.scrollLeft = 0;
  }

  private scrollEventCallback(): void {
    if (!this.#ticking) {
        window.requestAnimationFrame(() => {
          const index = this.findIndex(this.#track.scrollLeft, this.#track.scrollWidth);
          // Update classes only if active slide has changed
          if (index !== this.#currentIndex) {
            this.activeSlide(index);
          }
          this.#ticking = false;
        });
      }

      this.#ticking = true;
  }
}
