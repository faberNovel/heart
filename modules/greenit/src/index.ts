import { GreenITModule } from "./GreenITModule.js"

export const dotEnvSchema = {}

export function initialize() {
  return new GreenITModule({
    name: "Heart GreenIT",
    service: {
      name: "GreenIT Analysis",
      logo: "https://raw.githubusercontent.com/faberNovel/heart/main/assets/images/logos/GreenIT.png?v=20221214",
    },
  })
}
