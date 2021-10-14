import { ReportInterface, ServiceInterface } from '@fabernovel/heart-core'

export type LighthouseReportType = unknown // TODO: real report type

export default class LighthouseReport implements ReportInterface<LighthouseReportType> {
  analyzedUrl: string
  date: Date
  resultUrl?: string
  service: ServiceInterface
  value: LighthouseReportType

  constructor(report: ReportInterface<LighthouseReportType>) {
    Object.assign(this, report)
  }
}
