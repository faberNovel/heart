import {
  isModuleAnalysis,
  isModuleNotification,
  isModuleStorage,
  AnalysisEvents,
  AnalysisInterface,
  Report,
} from '@fabernovel/heart-core';
import * as bodyParser from 'body-parser';
import { EventEmitter } from 'events';
import * as express from 'express';

/**
 * Creates and configures an ExpressJS web server.
 */
export default class App {
  // reference to the Express instance
  public express: express.Application;
  private eventEmitter: EventEmitter;

  constructor(modules: any[]) {
    this.express = express();
    this.eventEmitter = new EventEmitter();
    this.middleware();
    this.init(modules);
  }

  /**
   * Register:
   * - events listeners for Notifiecation modules
   * - routes for Analysis modules
   */
  private init(modules: any[]): void {
    const router = express.Router();

    modules.forEach((module: any) => {
      // register events
      if (isModuleNotification(module)) {
        const storage = new module.Notification();

        storage.registerEvents(this.eventEmitter);
      // register events
      } else if (isModuleStorage(module)) {
        const storage = new module.Storage();

        storage.registerEvents(this.eventEmitter);
      // register routes
      } else if (isModuleAnalysis(module)) {
        const analysis = new module.Analysis();

        router.post(analysis.getRoutePath(), this.createRouteHandler(analysis));
      }
    });

    this.express.use('/', router);
  }

  /**
   *
   */
  private createRouteHandler(analysis: AnalysisInterface): express.RequestHandler {
    return (req: express.Request, res: express.Response) => {
      analysis.start(req.body)
        .then((report: Report) => {
          this.eventEmitter.emit(AnalysisEvents.DONE, report);

          res.status(200).send({
            analyzedUrl: report.analyzedUrl,
            date: report.date,
            name: report.name,
            note: report.note,
            resultUrl: report.resultUrl,
          });
        })
        .catch((reason: any) => {
          console.error(reason);
        });
    };
  }

  /**
   * Configure Express middleware.
   */
  private middleware(): void {
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
  }
}
