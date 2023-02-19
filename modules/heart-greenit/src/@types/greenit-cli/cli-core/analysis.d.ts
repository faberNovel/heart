declare module "greenit-cli/cli-core/analysis.js" {
  import { SizeNames } from "greenit-cli"
  import { Browser } from "puppeteer"

  interface Action {
    type: "click" | "text" | "select" | "scroll"
    element: string
    content: unknown
    timeoutBefore: number
    values: unknown
  }

  interface PageInformation {
    url: string
    screenshot?: string
    actions?: Action[] | { screenshot: string }
    waitForSelector?: string
    waitForXPath?: string
  }

  interface Options {
    timeout?: number
    max_tab?: number
    retry?: number
    device?: SizeNames
    ci?: boolean
  }

  interface Proxy {
    user: string
    password: string
  }

  interface Report {
    name: string
    path: string
  }

  export function createJsonReports(
    browser: Browser,
    pagesInformations: PageInformation[],
    options: Options,
    proxy?: Proxy,
    headers?: Record<string, string>
  ): Promise<Report[]>
}
