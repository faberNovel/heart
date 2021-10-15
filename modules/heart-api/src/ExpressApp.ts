import {
  isModuleAnalysis,
  isModuleListener,
  AnalysisEvents,
  ModuleAnalysisInterface,
  ModuleInterface,
  Report,
} from '@fabernovel/heart-core';
import * as EventEmitter from 'events';
import * as express from 'express';

/**
 * Creates and configures an ExpressJS application.
 */
export default class ExpressApp {
  // reference to the Express instance
  private _express: express.Application;
  private eventEmitter: EventEmitter;

  constructor(modules: ModuleInterface[]) {
    this._express = express();
    this.addMiddleware();
    this.eventEmitter = new EventEmitter();
    this.init(modules);
  }

  get express(): express.Application {
    return this._express;
  }

  private createRouteHandler(module: ModuleAnalysisInterface): express.RequestHandler {
    return (req: express.Request, res: express.Response) => {
      module.startAnalysis(req.body)
        .catch ((error) => {
          res
            .status(500)
            .send(error);
        })
        .then((report: Report) => {
          this.eventEmitter.emit(AnalysisEvents.DONE, report);

          res.status(200).send({
            analyzedUrl: report.analyzedUrl,
            date: report.date,
            service: {
              name: report.service.name
            },
            note: report.getNote(),
            normalizedNote: report.getNormalizedNote(),
            resultUrl: report.resultUrl,
          });
        });
    };
  }

  /**
   * Register:
   * - events listeners for Listener modules
   * - routes for Analysis modules
   */
  private init(modules: ModuleInterface[]): void {
    const router = express.Router();

    modules.forEach((module: ModuleInterface) => {
      // register events
      if (isModuleListener(module)) {
        module.registerEvents(this.eventEmitter);
      // register routes
      } else if (isModuleAnalysis(module)) {
        const path = `/${module.id}`;

        router.post(path, this.createRouteHandler(module));
      }
    });

    this.express.use('/', router);
  }

  /**
   * Configure Express middleware for the given path
   */
  private addMiddleware(): void {
    this.express.use([
      express.json(),
      express.urlencoded({ extended: false })
    ]);
  }
}
