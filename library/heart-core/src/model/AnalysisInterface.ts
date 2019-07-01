import Report from './Report';

/**
 * Define an Analysis.
 * Every Analysis module must have a class that implements this interface.
 */
export default interface AnalysisInterface {
  getRoutePath(): string;
  start(conf: any): Promise<Report>;
}

/**
 * Constructor interface signature
 * @see {@link https://www.typescriptlang.org/docs/handbook/interfaces.html#difference-between-the-static-and-instance-sides-of-classes}
 */
export type AnalysisConstructor = new () => AnalysisInterface;
