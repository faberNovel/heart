import type { Service } from "../../service/Service.js"
import type { GenericReport, ReportArguments } from "../Report.js"
import type { GreenITResult } from "./GreenITResult.js"

export class GreenITReport implements GenericReport<GreenITResult> {
  #analyzedUrl: string
  #date: Date
  #result: GreenITResult
  #resultUrl: string | undefined
  #service: Service
  #threshold: number | undefined

  constructor({ analyzedUrl, date, result, resultUrl, service, threshold }: ReportArguments<GreenITResult>) {
    this.#analyzedUrl = analyzedUrl
    this.#date = date
    this.#result = result
    this.#resultUrl = resultUrl
    this.#service = service
    this.#threshold = threshold
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

  displayGrade(): string {
    return this.normalizedGrade.toString() === this.grade
      ? `${this.grade}/100`
      : `${this.grade} (${this.normalizedGrade}/100)`
  }

  isThresholdReached(): boolean | undefined {
    return this.threshold !== undefined ? this.normalizedGrade >= this.threshold : undefined
  }
}
