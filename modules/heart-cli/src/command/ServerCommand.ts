import { ModuleServerInterface } from '@fabernovel/heart-core';
import { Command } from 'commander';

type Options = Partial<{
  port: string,
}>

export class ServerCommand {
  private static readonly REGEX_PORT = /^(0|[1-9][0-9]{0,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/;

  /**
   * Create a command dedicated to the given server module
   */
  public static create(program: Command, module: ModuleServerInterface, callback: (port: number) => void): void {
    program
      .command(module.id)
      .description(`Starts the ${module.name} server`)
      .option('-p, --port [port]', 'Port that the server is listening to', (value: string) => ServerCommand.REGEX_PORT.test(value) ? value : '3000', '3000')
      .action((options: Options) => {
        const { port } = options
  
        callback(Number(port))
      });
  }
}
