import ServiceInterface from '../service/ServiceInterface';

export default interface ModuleInterface {
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
