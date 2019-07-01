import * as express from 'express';
import * as http from 'http';

export default class NodeServer {
  private expressApplication: express.Application;
  private port: number|string|boolean;

  constructor(expressApplication: express.Application, port: string | number) {
    this.expressApplication = expressApplication;
    this.port = this.normalizePort(port);
  }

  public start(): void {
    console.log('Starting server...');

    this.expressApplication.set('port', this.port);

    http.createServer(this.expressApplication)
      .listen(this.port)
      .on('error', this.onError.bind(this));

    console.log('Server started. Enjoy :)');
  }

  private onError(error: NodeJS.ErrnoException): void {
    if (error.syscall !== 'listen') {
      throw error;
    }
    const bind = (typeof this.port === 'string') ? 'Pipe ' + this.port : 'Port ' + this.port;
    switch (error.code) {
      case 'EACCES':
        console.error('%s requires elevated privileges', bind);
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error('%s is already in use', bind);
        process.exit(1);
        break;
      default:
        throw error;
    }
  }

  private normalizePort(port: number|string): number|string|boolean {
    const normalizedPort: number = (typeof port === 'string') ? parseInt(port, 10) : port;

    if (isNaN(normalizedPort)) {
      return port;
    } else if (normalizedPort >= 0) {
      return normalizedPort;
    } else {
      return false;
    }
  }
}
