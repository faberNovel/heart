import type { Service } from "../service/Service.js"

export interface ModuleMetadata {
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
