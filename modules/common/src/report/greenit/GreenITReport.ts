import type { ValidatedAnalysisInput } from "../../index.js"
import type { Service } from "../../service/Service.js"
import type { GenericReport, ReportArguments } from "../Report.js"
import type { GreenITResult } from "./GreenITResult.js"

export class GreenITReport implements GenericReport<GreenITResult> {
  #analyzedUrl: string
  #date: Date
  #result: GreenITResult
  #resultUrl: string | undefined
  #service: Service
  #inputs: Pick<ValidatedAnalysisInput, "config" | "threshold">

  constructor({ analyzedUrl, date, result, resultUrl, service, inputs }: ReportArguments<GreenITResult>) {
    this.#analyzedUrl = analyzedUrl
    this.#date = date
    this.#result = result
    this.#resultUrl = resultUrl
    this.#service = service
    this.#inputs = inputs
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

  get inputs(): Pick<ValidatedAnalysisInput, "config" | "threshold"> {
    return this.#inputs
  }

  displayGrade(): string {
    return this.normalizedGrade.toString() === this.grade
      ? `${this.grade}/100`
      : `${this.grade} (${this.normalizedGrade}/100)`
  }

  isThresholdReached(): boolean | undefined {
    return this.inputs.threshold !== undefined ? this.normalizedGrade >= this.inputs.threshold : undefined
  }
}
