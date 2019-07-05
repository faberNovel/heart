import { ModuleLoader } from '@fabernovel/heart-core';

import NodeServer from './server/NodeServer';
import App from './App';

// set environment variables from a.env file
// assume that the root path is the one from where the script has been called
// /!\ this approach does not follow symlink
require('dotenv').config({path: `${process.cwd()}/.env`});

export default class HeartServer {
  public static start(): void {
    const moduleLoader = new ModuleLoader(false);

    moduleLoader.load()
      .then((modules: any[]) => {
        const app = new App(modules);
        const server = new NodeServer(app.express, process.env.PORT || 3000);

        server.start();
      })
      .catch((e: Error) => {
        console.error(e.message);
        process.exit(1);
      });
  }
}
