import {
  isModuleListener,
  AnalysisEvents,
  ModuleAnalysisInterface,
  ModuleInterface,
  ModuleListenerInterface,
  ModuleServerInterface,
  ThresholdInputObject,
} from '@fabernovel/heart-core';
import * as EventEmitter from 'events';

export default class App {
  private eventEmitter: EventEmitter;
  private modules: ModuleInterface[];

  constructor(modules: ModuleInterface[]) {
    this.eventEmitter = new EventEmitter();
    this.modules = modules;
    this.registerEventsListeners();
  }

  public async startAnalysis(module: ModuleAnalysisInterface, conf: object, threshold?: ThresholdInputObject): Promise<void> {
    try {
      const report = await module.startAnalysis(conf, threshold);

      // print analyse result
      const reportName = report.service ? `[${report.service.name}] ` : '';
      const messageParts = [`${reportName}${report.analyzedUrl}: ${report.note}`];

      if (report.resultUrl) {
        messageParts.push(`View full report: ${report.resultUrl}`);
      }
      if (report.areThresholdsReached === true) {
        messageParts.push("Your thresholds are reached");
      } else if (report.areThresholdsReached === false) {
        messageParts.push("Your thresholds are not reached");
      }

      console.log(messageParts.join('. ') + '.');

      this.eventEmitter.emit(AnalysisEvents.DONE, report);

      // /!\ do not exit the node process at this point,
      //     because it could stop the execution of the event handlers
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  }

  public startServer(module: ModuleServerInterface, modules: ModuleInterface[], port: number): void {
    module
      .startServer(modules, port)
      .on('listening', () => console.log(`Server listening on port ${port}`))
      .on('error', (error: NodeJS.ErrnoException) => {
        console.error(error.message);
        process.exit(1);
      });
  }

  /**
   * Register events listeners for listening modules
   */
  private registerEventsListeners(): void {
    this.modules
      .filter((module: ModuleInterface) => isModuleListener(module))
      .forEach((module: ModuleListenerInterface) => module.registerEvents(this.eventEmitter));
  }
}
