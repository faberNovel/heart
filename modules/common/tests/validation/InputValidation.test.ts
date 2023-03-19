import { jest } from "@jest/globals"
import { PathLike } from "node:fs"

const MOCK_FILE_INFO: Record<string, string> = {
  "existingConfig.json": '{"url": "https://www.heart.fabernovel.com"}',
}

const mockIsAbsolute = jest.fn(() => true)
const mockReadFileSync = jest.fn((path: PathLike | number): Buffer => {
  if (typeof path !== "string" || !Object.keys(MOCK_FILE_INFO).some((filename) => filename === path)) {
    throw new Error()
  }

  return Buffer.from(MOCK_FILE_INFO[path], "utf8")
})

jest.unstable_mockModule("node:fs", () => ({
  readFileSync: mockReadFileSync,
}))

jest.unstable_mockModule("node:path", () => ({
  isAbsolute: mockIsAbsolute,
}))

await import("node:fs")
await import("node:path")
const { validateInput } = await import("../../src/validation/InputValidation.js")

test("Provide no configurations", () => {
  expect(() => {
    validateInput(undefined, undefined, undefined, [], undefined, undefined)
  }).toThrow()
})

test("Provide two configurations", () => {
  expect(() => {
    validateInput("", "", undefined, [], undefined, undefined)
  }).toThrow()
})

test("Provide an inline configuration", () => {
  const [config] = validateInput(
    undefined,
    '{"inline": "configuration"}',
    undefined,
    [],
    undefined,
    undefined
  )
  expect(config).toEqual({ inline: "configuration" })
})

describe("Provide a file configuration", () => {
  beforeEach(() => {
    // does not seem to work with ESM
    // mockIsAbsolute.mockReset()
    // mockReadFileSync.mockReset()
  })

  test("Provide missing file configuration", () => {
    // does not seem to work with ESM
    // expect(mockIsAbsolute).toHaveBeenCalledTimes(1)
    // expect(mockReadFileSync).toHaveBeenCalledTimes(1)
    expect(() => {
      validateInput("missingConfig.json", undefined, undefined, [], undefined, undefined)
    }).toThrow()
  })

  test("Provide existing file configuration", () => {
    const [config] = validateInput("existingConfig.json", undefined, undefined, [], undefined, undefined)

    // does not seem to work with ESM
    // expect(mockIsAbsolute).toHaveBeenCalledTimes(1)
    // expect(mockReadFileSync).toHaveBeenCalledTimes(1)
    expect(config).toEqual(JSON.parse(MOCK_FILE_INFO["existingConfig.json"]))
  })
})
