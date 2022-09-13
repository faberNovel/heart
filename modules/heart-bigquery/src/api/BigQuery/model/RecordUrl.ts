export class RecordUrl {
  public analyzed: string
  public report?: string

  constructor(analyzed: string, report = "") {
    this.analyzed = analyzed
    this.report = report
  }
}
