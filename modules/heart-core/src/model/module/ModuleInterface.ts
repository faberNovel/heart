import {ServiceInterface} from '../service/ServiceInterface';

export interface ModuleInterface {
  /**
   * Example: observatory
   */
  id: string;

  /**
   * Example: Heart Observatory
   */
  name: string;

  service: ServiceInterface;
}
