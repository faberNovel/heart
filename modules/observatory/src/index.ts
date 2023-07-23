import { ObservatoryModule } from "./ObservatoryModule.js"

export function initialize() {
  return new ObservatoryModule({
    name: "Heart Observatory",
    service: {
      name: "Mozilla Observatory",
      logo: "https://raw.githubusercontent.com/faberNovel/heart/main/assets/images/logos/Observatory.png?v=20221126",
    },
  })
}
