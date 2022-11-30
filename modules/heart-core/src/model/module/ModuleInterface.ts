import { Service } from "../service/Service"

export interface ModuleInterface {
  /**
   * Example: observatory
   */
  id: string

  /**
   * Example: Heart Observatory
   */
  name: string

  service: Service
}
