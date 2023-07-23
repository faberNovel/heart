import { ApiModule } from "./ApiModule.js"

export function initialize() {
  return new ApiModule({
    name: "Heart API",
    service: {
      name: "Heart API",
    },
  })
}
