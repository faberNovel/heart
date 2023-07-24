import type { FastifyCorsOptions } from "@fastify/cors"
import type { JsonValue } from "type-fest"
import type { ParsedCommonInput, ValidatedCommonInput } from "./CommonInput.js"

export interface ParsedServerInput extends ParsedCommonInput {
  cors?: JsonValue
  port: number
  verbose: boolean
}

export interface ValidatedServerInput extends ValidatedCommonInput {
  cors?: FastifyCorsOptions
  port: number
  verbose: boolean
}
