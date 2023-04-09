import type { JsonObject } from "type-fest"

export interface ValidatedInput {
  config: JsonObject
  threshold?: number
  except_listeners?: string[]
  only_listeners?: string[]
}
