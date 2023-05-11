import fetch from "node-fetch"
import type { ParsedUrlQueryInput } from "querystring"

const BASE_HEADER: Record<"Content-Type", string> = {
  "Content-Type": "application/json",
}

export async function get<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    method: "GET",
    headers: BASE_HEADER,
  })

  return response.json() as Promise<T>
}

export async function post<T>(url: string, body: ParsedUrlQueryInput = {}): Promise<T> {
  const stringifiedBody = JSON.stringify(body)

  const response = await fetch(url, {
    method: "POST",
    body: stringifiedBody,
    headers: BASE_HEADER,
  })

  return response.json() as Promise<T>
}
