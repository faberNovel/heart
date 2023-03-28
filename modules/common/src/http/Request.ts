import fetch from "node-fetch"
import { ParsedUrlQueryInput, stringify } from "querystring"

const BASE_HEADER: Record<"Content-Type", string> = {
  "Content-Type": "application/json",
}

const ALLOWED_HEADERS_FOR_POST = ["application/json", "application/x-www-form-urlencoded"] as const
type AllowedHeadersForPostType = (typeof ALLOWED_HEADERS_FOR_POST)[number]

function isContentTypeHeaderAllowedForPost(header: string): header is AllowedHeadersForPostType {
  return ALLOWED_HEADERS_FOR_POST.includes(header as AllowedHeadersForPostType)
}

export async function get<T>(url: string, headers: Record<string, string> = {}): Promise<T> {
  const response = await fetch(url, {
    method: "GET",
    headers: { ...BASE_HEADER, ...headers },
  })

  return response.json() as Promise<T>
}

export async function post<T>(
  url: string,
  body: ParsedUrlQueryInput = {},
  headers: Record<string, string> = {}
): Promise<T> {
  const completeHeaders: Record<string, string> = { ...BASE_HEADER, ...headers }

  const contentTypeHeader = completeHeaders["Content-Type"]

  if (!isContentTypeHeaderAllowedForPost(contentTypeHeader)) {
    const errorMessage = `Unsupported Content-Type header value. Allowed values: ${ALLOWED_HEADERS_FOR_POST.join(
      ", "
    )}.`
    return Promise.reject(errorMessage)
  }

  const stringifiedBody = contentTypeHeader === "application/json" ? JSON.stringify(body) : stringify(body)

  const response = await fetch(url, {
    method: "POST",
    body: stringifiedBody,
    headers: completeHeaders,
  })

  return response.json() as Promise<T>
}
