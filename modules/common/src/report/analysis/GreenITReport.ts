import { GreenITResult } from "../../index.js"
import { Service } from "../../service/Service.js"
import { GenericReport, ReportArguments } from "../Report.js"

export class GreenITReport implements GenericReport<GreenITResult> {
  #analyzedUrl: string
  #date: Date
  #result: GreenITResult
  #resultUrl: string | undefined
  #service: Service
  #threshold: number | undefined

  constructor({ analyzedUrl, date, result, service, resultUrl }: ReportArguments<GreenITResult>) {
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
    return this.#result.ecoIndex
  }

  get result(): GreenITResult {
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
