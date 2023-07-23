import { MySQLModule } from "./MySQLModule.js"

export function initialize() {
  return new MySQLModule({
    name: "Heart MySQL",
    service: {
      name: "MySQL",
    },
  })
}
