import { ModuleServerInterface } from '@fabernovel/heart-core';
import * as program from 'commander';
import * as http from 'http';

import {ServerCommand} from '../../src/command/ServerCommand';

test('Create a server command', () => {
  const module: ModuleServerInterface = {
    id: 'test-server',
    name: 'Heart Test Server',
    service: {
      name: 'Test Server'
    },
    startServer: () => http.createServer()
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  ServerCommand.create(program, module, () => {});

  expect(program.commands[0]._name).toBe(module.id);
  expect(program.commands[0].options.length).toBe(1);
  expect(program.commands[0].options[0].short).toBe('-p');
  expect(program.commands[0].options[0].long).toBe('--port');
});
