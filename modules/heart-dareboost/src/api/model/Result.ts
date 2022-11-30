import { RawResults } from "@fabernovel/heart-core"

/**
 * @see {@link https://www.dareboost.com/fr/documentation-api#result}
 */
export type DareboostResult = RawResults & {
  status: number
  message: string
  missing: unknown[]
  report: {
    publicReportUrl: string
    harFileUrl: string
    date: number
    url: string
    lang: string
    config: {
      location: string
      browser: {
        name: string
        version: string
      }
      isMobile: boolean
      bandwidth: {
        upstream: number
        downstream: number
      }
      latency: number
      isPrivate: boolean
      screen: {
        height: number
        width: number
      }
      basicAuth: {
        user: string
        password: string
      }
      postData: [
        {
          key: string
          value: string
        }
      ]
      header: [
        {
          key: string
          value: string
        }
      ]
      blacklist: unknown[]
      whiteList: unknown[]
      dnsMapping: [
        {
          origin: string
          destination: string
        }
      ]
    }
    summary: {
      loadTime: number
      score: number
      requestsCount: number
      weight: number
    }
    categories: [
      {
        name: string
      }
    ]
    tips: [
      {
        advice: string
        category: string
        score: number
        name: string
        priority: number
      }
    ]
    timings: {
      firstByte: number
      firstPaint: number
      domInteractive: number
      loadEvent: number
      startRender: number
      speedIndex: number
      visuallyComplete: number
      oldVisuallyComplete: number
    }
    resourceByType: [
      {
        type: string
        bodyWeight: number
        headerWeight: number
        requestCount: number
      }
    ]
    technos: [
      {
        name: string
        version: string
      }
    ]
  }
}
