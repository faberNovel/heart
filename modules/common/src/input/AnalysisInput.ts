import type { JsonObject, JsonValue } from "type-fest"

export interface ParsedAnalysisInput {
  config: JsonValue
  threshold?: number
  except_listeners?: string[]
  only_listeners?: string[]
}

export interface ValidatedAnalysisInput {
  config: JsonObject
  threshold?: number
  except_listeners?: string[]
  only_listeners?: string[]
}
