import {ServiceInterface} from '../service/ServiceInterface';

import {ModuleInterface} from './ModuleInterface';

export abstract class Module implements ModuleInterface {
  id = ''
  readonly name: string
  readonly service: ServiceInterface

  constructor(module: Pick<ModuleInterface, 'name' | 'service'>) {
    this.name = module.name
    this.service = module.service
  }
}
