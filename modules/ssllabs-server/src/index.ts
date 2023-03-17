import { SsllabsServerModule } from "./SsllabsServerModule.js"

export default new SsllabsServerModule({
  name: "Heart SSL Labs Server",
  service: {
    name: "Qualys SSL Labs Server",
    logo: "https://raw.githubusercontent.com/faberNovel/heart/main/assets/images/logos/SSLLabs.png?v=20221126",
  },
})
