import ServiceInterface from '../service/ServiceInterface';

import ModuleInterface from './ModuleInterface';

export default abstract class Module implements ModuleInterface {
  /**
   * Examples: dareboost, observatory...
   * The id is automatically guessed from the package name, so do not set it explicitely
   */
  id: string;

  /**
   * Example: Heart Observatory, Heart BigQuery
   */
  name: string;

  service: ServiceInterface;

  constructor(module: Partial<ModuleInterface>) {
    Object.assign(this, module);
  }
}
