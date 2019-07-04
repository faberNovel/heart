import {
  isModuleAnalysis,
  isModuleNotification,
  isModuleStorage,
  AnalysisEvents,
  AnalysisInterface,
  ModuleAnalysisInterface,
  ModuleNotificationInterface,
  ModuleStorageInterface,
  NotificationInterface,
  Report,
  StorageInterface
} from '@fabernovel/heart-core';
import * as EventEmitter from 'events';

export default class App {
  private eventEmitter: EventEmitter;
  private _analysisModules: ModuleAnalysisInterface[];
  private _listeningModules: (ModuleNotificationInterface | ModuleStorageInterface)[];

  constructor(modules: any[]) {
    this.eventEmitter = new EventEmitter();
    this._analysisModules = modules.filter((module: any) => isModuleAnalysis(module));
    this._listeningModules = modules.filter((module: any) => isModuleNotification(module) || isModuleStorage(module));
    this.registerEventsListeners();
  }

  get analysisModules(): ModuleAnalysisInterface[] {
    return this._analysisModules;
  }

  get listeningModules(): (ModuleNotificationInterface | ModuleStorageInterface)[] {
    return this._listeningModules;
  }

  /**
   * Start an analysis for the matching Analysis modules
   */
  public start(moduleNameSuffix: string, conf: object): void {
    let analysis: AnalysisInterface;

    // look for the loaded analysis modules that match the given moduleNameSuffix
    const analysisModules = this.analysisModules.filter((module: any) => {
      analysis = new module.Analysis();

      return analysis.getRoutePath() === moduleNameSuffix;
    });

    if (1 !== analysisModules.length) {
      return;
    }

    const analysisModule = analysisModules[0];
    analysis = new analysisModule.Analysis();

    analysis.start(conf)
      .then((report: Report) => {
        // Print analyse result
        const reportName = report.name ? `[${report.name}] ` : '';
        console.log(`${reportName}${report.analyzedUrl}: ${report.note}, view full report: ${report.resultUrl}`);

        this.eventEmitter.emit(AnalysisEvents.DONE, report);

        // /!\ do not exit the node process at this point,
        //     because it could stop the execution of the event handlers
      })
      .catch(e => {
        console.error(e);
        process.exit(1);
      });
  }

  /**
   * Register events listeners for listening modules
   */
  private registerEventsListeners(): void {
    this.listeningModules.forEach((module: any) => {
      let moduleInstance: NotificationInterface | StorageInterface;

      if (isModuleNotification(module)) {
        moduleInstance = new module.Notification();
      } else if (isModuleStorage(module)) {
        moduleInstance = new module.Storage();
      }

      if (moduleInstance) {
        moduleInstance.registerEvents(this.eventEmitter);
      }
    });
  }
}
