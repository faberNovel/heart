import type { Entry } from "har-format"
import type { Result } from "../Result.js"

/**
 * Short version of the generated JSON result file
 */
export type GreenITResult = Result & {
  url: string
  ecoIndex: number
  domSize: number
  nbRequest: number
  responsesSize: number
  responsesSizeUncompress: number
  grade: string
  waterConsumption: number
  greenhouseGasesEmission: number
  pluginsNumber: number
  printStyleSheetsNumber: number
  inlineStyleSheetsNumber: number
  emptySrcTagNumber: number
  inlineJsScriptsNumber: number
  imagesResizedInBrowser: {
    src: string
    clientWidth: number
    clientHeight: number
    naturalWidth: number
    naturalHeight: number
  }[]
  entries: Entry[]
  dataEntries: Entry[]
  bestPractices: {
    AddExpiresOrCacheControlHeaders: {
      detailComment: string
      complianceLevel: string
      comment: string
    }
    CompressHttp: {
      detailComment: string
      complianceLevel: string
      comment: string
    }
    DomainsNumber: {
      detailComment: string
      comment: string
    }
    DontResizeImageInBrowser: {
      imgAnalysed: object
      detailComment: string
      imagesResizedInBrowserNumber: number
      complianceLevel: string
      comment: string
    }
    EmptySrcTag: object
    ExternalizeCss: { complianceLevel: string; comment: string }
    ExternalizeJs: { complianceLevel: string; comment: string }
    HttpError: { comment: string }
    HttpRequests: {
      detailComment: string
      comment: string
    }
    ImageDownloadedNotDisplayed: {
      imgAnalysed: object
      comment: string
    }
    JsValidate: {
      totalJsSize: number
      detailComment: string
      errors: number
      complianceLevel: string
      comment: string
    }
    MaxCookiesLength: object
    MinifiedCss: object
    MinifiedJs: {
      totalJsSize: number
      minifiedJsSize: number
      complianceLevel: string
      comment: string
    }
    NoCookieForStaticRessources: object
    NoRedirect: { comment: string }
    OptimizeBitmapImages: object
    OptimizeSvg: object
    Plugins: object
    PrintStyleSheet: { complianceLevel: string; comment: string }
    SocialNetworkButton: object
    StyleSheets: {
      detailComment: string
    }
    UseETags: {
      complianceLevel: string
      comment: string
    }
    UseStandardTypefaces: {
      detailComment: string
      complianceLevel: string
      comment: string
    }
  }
  success: boolean
  nbBestPracticesToCorrect: number
  // format: 30/11/2022 15:41:57
  date: string
  pageInformations: { url: string }
  tryNb: number
  tabId: number
  index: number
}
