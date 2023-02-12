import { jest } from "@jest/globals"
import { PathLike } from "node:fs"
import { validateInput } from "../../src/validation/InputValidation.js"

test("Provide no configurations", () => {
  expect(() => {
    validateInput()
  }).toThrow()
})

test("Provide two configurations", () => {
  expect(() => {
    validateInput("", "")
  }).toThrow()
})

test("Provide an inline configuration", () => {
  const [config] = validateInput(undefined, '{"inline": "configuration"}')
  expect(config).toEqual({ inline: "configuration" })
})

describe("Provide a file configuration", () => {
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

  beforeEach(async () => {
    jest.unstable_mockModule("node:fs", () => ({
      readFileSync: mockReadFileSync,
    }))

    jest.unstable_mockModule("node:path", () => ({
      isAbsolute: mockIsAbsolute,
    }))

    await import("node:fs")
    await import("node:path")
  })

  test("Provide missing file configuration", () => {
    expect(mockIsAbsolute).toHaveBeenCalledTimes(1)
    expect(mockReadFileSync).toHaveBeenCalledTimes(1)
    expect(() => {
      validateInput("missingConfig.json")
    }).toThrow()
  })

  test("Provide existing file configuration", () => {
    const [config] = validateInput("existingConfig.json")

    expect(mockIsAbsolute).toHaveBeenCalledTimes(1)
    expect(mockReadFileSync).toHaveBeenCalledTimes(1)
    expect(config).toEqual(JSON.parse(MOCK_FILE_INFO["existingConfig.json"]))
  })
})
