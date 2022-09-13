import * as fs from "fs"
import { PathLike } from "fs"
import * as path from "path"
import { AnalysisOptionsValidation } from "../../src/validation/AnalysisOptionsValidation"

const MOCK_FILE_INFO: Record<string, string> = {
  "existingConfig.json": '{"url": "https://www.heart.fabernovel.com"}',
}

jest.mock("fs", () => {
  const originalModule = jest.requireActual<typeof fs>("fs")

  return {
    ...originalModule,
    readFileSync: (path: PathLike | number): string => {
      if (typeof path !== "string" || !Object.keys(MOCK_FILE_INFO).some((filename) => filename === path)) {
        throw new Error()
      }

      return MOCK_FILE_INFO[path]
    },
  }
})

jest.mock("path", () => {
  const originalModule = jest.requireActual<typeof path>("path")

  return {
    ...originalModule,
    isAbsolute: () => true,
  }
})

test("Provide no configurations", () => {
  expect(() => {
    AnalysisOptionsValidation.validate()
  }).toThrow()
})

test("Provide two configurations", () => {
  expect(() => {
    AnalysisOptionsValidation.validate("", "")
  }).toThrow()
})

test("Provide an inline configuration", () => {
  const [config] = AnalysisOptionsValidation.validate(undefined, '{"inline": "configuration"}')
  expect(config).toEqual({ inline: "configuration" })
})

describe("Provide a file configuration", () => {
  test("Provide missing file configuration", () => {
    expect(() => {
      AnalysisOptionsValidation.validate("missingConfig.json")
    }).toThrow()
  })

  test("Provide existing file configuration", () => {
    const [config] = AnalysisOptionsValidation.validate("existingConfig.json")

    expect(config).toEqual(JSON.parse(MOCK_FILE_INFO["existingConfig.json"]))
  })
})
