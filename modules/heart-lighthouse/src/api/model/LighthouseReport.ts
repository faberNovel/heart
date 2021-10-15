import { GenericReport, ReportArguments, ReportUtils, ServiceInterface } from '@fabernovel/heart-core'

import compute, { Categories } from '../../scoring/compute'

type LighthouseReportType = Categories

export default class LighthouseReport implements GenericReport<LighthouseReportType> {
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
