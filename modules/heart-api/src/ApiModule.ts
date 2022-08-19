import { Module, ModuleInterface, ModuleServerInterface } from '@fabernovel/heart-core';
import * as http from 'http';

import {ExpressApp} from './ExpressApp';

export class ApiModule extends Module implements ModuleServerInterface {
  constructor(module: Omit<ModuleInterface, 'id'>) {
    super(module);
  }

  startServer(modules: ModuleInterface[], port?: number): http.Server {
    const app = new ExpressApp(modules);

    return http
      .createServer(app.express)
      .listen(port);
  }
}
