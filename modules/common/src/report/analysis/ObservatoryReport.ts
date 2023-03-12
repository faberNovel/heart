import { ObservatoryResult } from "../../index.js"
import { Service } from "../../service/Service.js"
import { GenericReport, ReportArguments } from "../Report.js"

export class ObservatoryReport implements GenericReport<ObservatoryResult> {
  #analyzedUrl: string
  #date: Date
  #result: ObservatoryResult
  #resultUrl: string | undefined
  #service: Service
  #threshold: number | undefined

  constructor({ analyzedUrl, date, result, service, resultUrl }: ReportArguments<ObservatoryResult>) {
    this.#analyzedUrl = analyzedUrl
    this.#date = date
    this.#result = result
    this.#service = service
    this.#resultUrl = resultUrl
  }

  get analyzedUrl(): string {
    return this.#analyzedUrl
  }

  get date(): Date {
    return this.#date
  }

  get grade(): string {
    return this.#result.grade
  }

  get isThresholdReached(): boolean | undefined {
    return this.#threshold !== undefined ? this.normalizedGrade >= this.#threshold : undefined
  }

  get normalizedGrade(): number {
    return this.#result.score
  }

  get result(): ObservatoryResult {
    return this.#result
  }

  get resultUrl(): string | undefined {
    return this.#resultUrl
  }

  get service(): Service {
    return this.#service
  }

  get threshold(): number | undefined {
    return this.#threshold
  }
}
