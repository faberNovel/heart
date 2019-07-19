import { Module, ModuleInterface, ModuleServerInterface } from '@fabernovel/heart-core';
import * as http from 'http';

import ExpressApp from './ExpressApp';

export default class ApiModule extends Module implements ModuleServerInterface {
  constructor(module: Partial<ModuleServerInterface>) {
    super(module);
  }

  startServer(modules: ModuleInterface[], port?: number): http.Server {
    const app = new ExpressApp(modules);

    return http
      .createServer(app.express)
      .listen(port);
  }
}