import { ReportArguments, ReportInterface, ReportUtils, ServiceInterface } from '@fabernovel/heart-core'

import compute, { Categories } from '../../scoring/compute'

export type LighthouseReportType = Categories

export default class LighthouseReport implements ReportInterface<LighthouseReportType> {
  analyzedUrl: string
  date: Date
  resultUrl?: string
  service: ServiceInterface
  value: LighthouseReportType

  constructor(report: ReportArguments<LighthouseReportType>) {
    Object.assign(this, report)
  }

  getNote() {
    return compute(this.value.categories, 1).toString()
  }

  getNormalizedNote() {
    return ReportUtils.getNormalizedNote({ note: this.getNote() })
  }
}
