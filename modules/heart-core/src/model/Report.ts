/**
 * Define a report that is common to every heart-* analysis module.
 *
 * /!\ WARNING /!\
 * Don't change the Report class structure: it's a central point in the exchanges between Heart modules.
 */
export default class Report {
  private _analyzedUrl: string;
  private _date: Date;
  private _name: string;
  private _note: string;
  private _normalizedNote: number;
  private _resultUrl: string;

  /**
   *
   * @param analyzedUrl The url that has been analyzed
   * @param note The global note that results from the analyze
   * @param resultUrl The url where a user can view the results of the analyze
   * @param name Name of the report
   * @param date Date of the report
   */
  constructor(analyzedUrl: string, note: string, resultUrl: string, name = '', date = new Date(), normalizedNote?: number) {
    this._analyzedUrl = analyzedUrl;
    this._date = date;
    this._name = name;
    this._note = note;
    const noteNormalized = parseInt(note, 10) || 0;
    this._normalizedNote = (normalizedNote === undefined) ? noteNormalized : normalizedNote;
    this._resultUrl = resultUrl;
  }

  get analyzedUrl(): string {
    return this._analyzedUrl;
  }

  get date(): Date {
    return this._date;
  }

  get name(): string {
    return this._name;
  }

  get note(): string {
    return this._note;
  }

  get normalizedNote(): number {
    return this._normalizedNote;
  }

  get resultUrl(): string {
    return this._resultUrl;
  }
}
