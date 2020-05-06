import { Breakpoint } from '../models/breakpoint';

export class Slider {
  // Attributes
  private static readonly ATTR_DATA_INDEX = 'data-index';
  // Classes
  private static readonly CLASS_DISPLAY_DOTS = '-displayDots';
  private static readonly CLASS_IS_ACTIVE = '-isActive';
  // Selectors
  private static readonly SELECTOR = '.slider';
  private static readonly SELECTOR_SLIDE = `${Slider.SELECTOR}__slide`;
  private static readonly SELECTOR_DOTS_ITEM = `${Slider.SELECTOR}__dotsItem`;
  private static readonly SELECTOR_DOTS_WRAP = `${Slider.SELECTOR}__dotsWrap`;
  private static readonly SELECTOR_DOTS_LI = `${Slider.SELECTOR_DOTS_WRAP} > li`;
  private static readonly SELECTOR_TRACK = `${Slider.SELECTOR}__track`;

  #currentIndex: number; // current index of active slide (from 0)
  #dotsEventCallback: (ev: Event) => any; // use because bind(this) changed the function signature: https://stackoverflow.com/a/22870717
  #dotsLi: NodeListOf<HTMLElement> // list of li element with SELECTOR_DOTS_LI class name
  #track: HTMLElement; // HTML element which contains all slides
  #scrollEventCallback: (ev: Event) => any; // use because bind(this) changed the function signature: https://stackoverflow.com/a/22870717
  #slides: NodeListOf<HTMLElement>; // list of HTML element with SELECTOR_SLIDE class name
  #ticking = false;

  /**
   * @param element HTMLElement with SELECTOR class name
   */
  constructor(element: HTMLElement) {
    this.#dotsEventCallback = this.dotsEventCallback.bind(this);
    this.#dotsLi = element.querySelectorAll(Slider.SELECTOR_DOTS_LI);
    this.#scrollEventCallback = this.scrollEventCallback.bind(this);
    this.#slides = element.querySelectorAll(Slider.SELECTOR_SLIDE);
    this.#track = element.querySelector(Slider.SELECTOR_TRACK);
    this.activeSlide(0);

    // Display dots is JavaScript is activated
    element.classList.add(Slider.CLASS_DISPLAY_DOTS);
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
      sliders.forEach(slider => {
        slider.addDotsEvent();
        slider.addScrollEvent();
      })
    } else {
      sliders.forEach(slider => {
        slider.removeDotsEvent();
        slider.removeScrollEvent();
      })
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
   * Add dot event to scroll on associated slide
   */
  private addDotsEvent(): void {
    this.#dotsLi.forEach(dotLi => {
      dotLi.querySelector(Slider.SELECTOR_DOTS_ITEM).addEventListener('click', this.#dotsEventCallback);
    })
  }

  /**
   * Add scroll event to find active slide
   */
  private addScrollEvent(): void {
    this.#track.addEventListener('scroll', this.#scrollEventCallback);
  }

  /**
   * Scrolls to slide according to dot index
   *
   * @param event MouseEvent when user click on dot
   */
  private dotsEventCallback(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    const dotIndex = parseInt((event.currentTarget as HTMLElement).getAttribute(Slider.ATTR_DATA_INDEX), 10);

    // number of pixels along the horizontal axis to display the correct slide from scroll container
    const scrollLeft = Math.floor(this.#track.scrollWidth * (dotIndex / this.#slides.length));

    this.#track.scrollTo({
      left: scrollLeft,
      behavior: 'smooth'
    });
  }

  /**
   * Get index of current slide
   * If we see two slides, we take the most visible one (throught halfOfSlide variable)
   */
  private findIndex(): number {
    const slideWidth = this.#track.scrollWidth / this.#slides.length;
    const halfOfSlide = slideWidth / 2;

    return Math.floor((this.#track.scrollLeft + halfOfSlide) / slideWidth);
  }

  private removeDotsEvent(): void {
    this.#dotsLi.forEach(dotLi => {
      dotLi.querySelector(Slider.SELECTOR_DOTS_ITEM).removeEventListener('click', this.#dotsEventCallback);
    })
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

  /**
   * Search the current activated slide when scroll has changed
   */
  private scrollEventCallback(): void {
    if (!this.#ticking) {
        window.requestAnimationFrame(() => {
          const index = this.findIndex();
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
