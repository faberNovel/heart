import LH from 'lighthouse'

export interface Config {
  url: string
  config?: LH.Config.Json
}
