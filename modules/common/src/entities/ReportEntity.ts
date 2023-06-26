import { Cascade, Entity, ManyToOne, Property } from "@mikro-orm/core"
import type Report from "../report/Report.js"
import type { GenericReport } from "../report/Report.js"
import { ServiceEntity } from "./ServiceEntity.js"

@Entity()
export class ReportEntity<T> {
  @Property()
  analyzedUrl!: Report["analyzedUrl"]

  @Property()
  date!: Report["date"]

  @Property()
  grade!: Report["grade"]

  @Property()
  normalizedGrade!: Report["normalizedGrade"]

  @Property({ type: "json" })
  result!: T

  @Property()
  resultUrl?: Report["resultUrl"]

  @ManyToOne({ cascade: [Cascade.PERSIST, Cascade.REMOVE] })
  service!: Report["service"]

  constructor(report: GenericReport<T>) {
    this.analyzedUrl = report.analyzedUrl
    this.date = report.date
    this.grade = report.grade
    this.normalizedGrade = report.normalizedGrade
    this.result = report.result
    this.resultUrl = report.resultUrl
    this.service = new ServiceEntity(report.service)
  }
}
