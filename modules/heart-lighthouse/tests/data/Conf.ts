import { LighthouseConfig } from "../../src/config/Config";

export const Conf: LighthouseConfig = {
  url: 'https://heart.fabernovel.com',
  config: {
    extends: 'lighthouse:default',
    settings: {
      onlyAudits: [
        'first-meaningful-paint',
        'speed-index',
        'first-cpu-idle',
        'interactive'
      ]
    }
  }
};
