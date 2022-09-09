import {
  isModuleAnalysis,
  isModuleListener,
  AnalysisEvents,
  ModuleAnalysisInterface,
  ModuleInterface,
  Report,
  Config,
  ThresholdInputObject,
} from '@fabernovel/heart-core';
import { CorsOptions } from 'cors';
import cors = require('cors');
import * as EventEmitter from 'events';
import * as express from 'express';

/**
 * Creates and configures an ExpressJS application.
 */
export class ExpressApp {
  // reference to the Express instance
  private _express: express.Application;
  private eventEmitter: EventEmitter;

  constructor(modules: ModuleInterface[], corsOptions?: CorsOptions) {
    this._express = express();
    this.addMiddleware(corsOptions);
    this.eventEmitter = new EventEmitter();
    this.init(modules);
  }

  get express(): express.Application {
    return this._express;
  }

  private createRouteHandler<T extends Config>(module: ModuleAnalysisInterface<T>): express.RequestHandler {
    return (request: express.Request<unknown, unknown, T>, response) => {
      try {
        const thresholds = 'string' === typeof request.query.thresholds ? JSON.parse(request.query.thresholds) as ThresholdInputObject : undefined

        module.startAnalysis(request.body, thresholds)
        .then((report: Report) => {
          this.eventEmitter.emit(AnalysisEvents.DONE, report);

          response.status(200).send({
            analyzedUrl: report.analyzedUrl,
            date: report.date,
            service: {
              name: report.service.name
            },
            note: report.note,
            normalizedNote: report.normalizedNote,
            resultUrl: report.resultUrl,
            thresholds: request.body.threshold
          });
        })
        .catch ((error) => {
          console.error(error)
          response
            .status(500)
            .send(error);
        });
      } catch (error) {
        console.error(error)
        response
          .status(500)
          .send(error);
      }
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
  private addMiddleware(corsOptions?: CorsOptions): void {
    const middlewares = [
      express.json(),
      express.urlencoded({ extended: false }),
    ]

    if (undefined !== corsOptions) {
      middlewares.push(cors(corsOptions))
    }

    this.express.use(middlewares);
  }
}
