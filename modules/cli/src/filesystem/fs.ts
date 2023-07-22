import { readFileSync } from "node:fs"
import { isAbsolute } from "node:path"
import { env } from "node:process"

export function readFile(path: string): string {
  const realPath = isAbsolute(path) ? path : `${env.PWD ?? ""}/${path}`

  return readFileSync(realPath, "utf8")
}
