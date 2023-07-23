import { BigQueryModule } from "./BigQueryModule.js"

export function initialize() {
  return new BigQueryModule({
    name: "Heart BigQuery",
    service: {
      name: "Google BigQuery",
      logo: "https://raw.githubusercontent.com/faberNovel/heart/main/assets/images/logos/BigQuery.png?v=20221126",
    },
  })
}
