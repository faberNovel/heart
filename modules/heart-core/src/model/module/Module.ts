import {ServiceInterface} from '../service/ServiceInterface';

import {ModuleInterface} from './ModuleInterface';

export abstract class Module implements ModuleInterface {
  /**
   * Examples: dareboost, observatory...
   * The id is automatically guessed from the package name, so do not set it explicitly
   */
  id: string;

  /**
   * Example: Heart Observatory, Heart BigQuery
   */
  name: string;

  service: ServiceInterface;

  protected constructor(module: Partial<ModuleInterface>) {
    Object.assign(this, module);
  }
}
