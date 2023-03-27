import fetch from "node-fetch"
import { ParsedUrlQueryInput, stringify } from "querystring"

const GET = "GET"
const POST = "POST"
export const HEADER_CONTENT_TYPE = "Content-Type"
const HEADER_CONTENT_TYPE_JSON = "application/json"
export const HEADER_CONTENT_TYPE_X_WWW_FORM_URLENCODED = "application/x-www-form-urlencoded"
const BASE_HEADER = {
  [HEADER_CONTENT_TYPE]: HEADER_CONTENT_TYPE_JSON,
}

export async function get<T>(url: string, headers: Record<string, string> = {}): Promise<T> {
  const response = await fetch(url, {
    method: GET,
    headers: { ...BASE_HEADER, ...headers },
  })

  return response.json() as Promise<T>
}

export async function post<T>(
  url: string,
  body: ParsedUrlQueryInput = {},
  headers: Record<string, string> = {}
): Promise<T> {
  let bodyString = ""

  headers = { ...BASE_HEADER, ...headers }
  switch (headers[HEADER_CONTENT_TYPE]) {
    case HEADER_CONTENT_TYPE_JSON:
      bodyString = JSON.stringify(body)
      break
    case HEADER_CONTENT_TYPE_X_WWW_FORM_URLENCODED:
      bodyString = stringify(body)
      break
    default:
      return Promise.reject({ error: "invalid-header", message: "Unsupported header Content-Type" })
  }

  const response = await fetch(url, {
    method: POST,
    body: bodyString,
    headers,
  })

  return response.json() as Promise<T>
}
