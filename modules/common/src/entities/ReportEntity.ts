import { Cascade, Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core"
import type Report from "../report/Report.js"
import type { GenericReport } from "../report/Report.js"
import { ServiceEntity } from "./ServiceEntity.js"

@Entity({ tableName: "report" })
export class ReportEntity<Result> {
  @PrimaryKey()
  id!: number

  @Property()
  analyzedUrl!: Report["analyzedUrl"]

  @Property()
  date!: Report["date"]

  @Property()
  grade!: Report["grade"]

  @Property()
  normalizedGrade!: Report["normalizedGrade"]

  @Property({ type: "json" })
  result!: Result

  @Property()
  resultUrl?: Report["resultUrl"]

  @ManyToOne({ cascade: [Cascade.PERSIST] })
  service!: ServiceEntity

  constructor(report: GenericReport<Result>) {
    this.analyzedUrl = report.analyzedUrl
    this.date = report.date
    this.grade = report.grade
    this.normalizedGrade = report.normalizedGrade
    this.result = report.result
    this.resultUrl = report.resultUrl
    this.service = new ServiceEntity(report.service)
  }
}
