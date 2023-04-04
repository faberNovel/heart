import type { JsonObject, JsonValue } from "type-fest"

export interface ParsedInput {
  config: JsonValue
  threshold?: number
  except_listeners?: string[]
  only_listeners?: string[]
}

export interface ValidatedInput {
  config: JsonObject
  threshold?: number
  except_listeners?: string[]
  only_listeners?: string[]
}
