import { ModuleTplModule } from "./ModuleTplModule.js"

export function initialize() {
  return new ModuleTplModule({
    name: "Heart ModuleTpl",
    service: {
      name: "ModuleTpl",
      logo: "https://raw.githubusercontent.com/faberNovel/heart/main/assets/images/logos/ModuleTpl.png?v=20221126",
    },
  })
}
