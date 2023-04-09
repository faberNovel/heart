import type { FastifyCorsOptions } from "@fastify/cors"
import type { JsonValue } from "type-fest"

export interface ParsedServerInput {
  cors?: JsonValue
  port: number
}

export interface ValidatedServerInput {
  cors?: FastifyCorsOptions
  port: number
}
