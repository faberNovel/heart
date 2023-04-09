import type { JsonValue } from "type-fest"

export interface ParsedInput {
  config: JsonValue
  threshold?: number
  except_listeners?: string[]
  only_listeners?: string[]
}
