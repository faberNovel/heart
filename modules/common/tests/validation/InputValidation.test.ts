import { jest } from "@jest/globals"
import type { ModuleListenerInterface } from "../../src/index.js"

const MOCK_FILE_INFO: Record<string, string> = {
  "existingConfig.json": '{"url": "https://www.heart.fabernovel.com"}',
}

jest.unstable_mockModule("../../src/filesystem/fs.js", () => ({
  readFile: jest.fn((path: string): string => {
    if (Object.hasOwn(MOCK_FILE_INFO, path)) {
      return MOCK_FILE_INFO[path]
    } else {
      throw new Error()
    }
  }),
}))

const { readFile } = await import("../../src/filesystem/fs.js")
const { ConfigInputError, ListenersInputError } = await import("../../src/index.js")
const { validateInput } = await import("../../src/validation/InputValidation.js")

test("Provide no configurations", () => {
  expect(() => {
    validateInput(undefined, undefined, undefined, [], undefined, undefined)
  }).toThrow(ConfigInputError)
})

test("Provide two configurations", () => {
  expect(() => {
    validateInput("", "", undefined, [], undefined, undefined)
  }).toThrow(ConfigInputError)
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
  test("Provide a nonexistent file", () => {
    expect(() => {
      validateInput("missingConfig.json", undefined, undefined, [], undefined, undefined)
    }).toThrow(ConfigInputError)
  })

  test("Provide an existent file", () => {
    const [config] = validateInput("existingConfig.json", undefined, undefined, [], undefined, undefined)

    expect(readFile).toHaveBeenCalledTimes(1)
    expect(config).toEqual(JSON.parse(MOCK_FILE_INFO["existingConfig.json"]))
  })
})

describe("Validate the listener modules options", () => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const notifyAnalysisDone = () => new Promise(() => {})

  const listenerModules: ModuleListenerInterface[] = [
    {
      id: "heart-test1",
      name: "Heart Test1",
      service: { name: "Test1" },
      notifyAnalysisDone: notifyAnalysisDone,
    },
    {
      id: "heart-test2",
      name: "Heart Test2",
      service: { name: "Test2" },
      notifyAnalysisDone: notifyAnalysisDone,
    },
  ]

  test("Exclude 1 module with an invalid id", () => {
    expect(() => {
      validateInput(
        undefined,
        '{"inline": "configuration"}',
        undefined,
        listenerModules,
        ["invalid-module-id"],
        undefined
      )
    }).toThrow(ListenersInputError)
  })

  test("Exclude 1 module with a valid id", () => {
    const [_config, _threshold, listenerModulesFiltered] = validateInput(
      undefined,
      '{"inline": "configuration"}',
      undefined,
      listenerModules,
      ["heart-test1"],
      undefined
    )

    expect(listenerModulesFiltered).toHaveLength(0)
  })

  test("Exclude 2 modules including 1 with an invalid id", () => {
    expect(() => {
      validateInput(
        undefined,
        '{"inline": "configuration"}',
        undefined,
        listenerModules,
        ["heart-test1", "invalid-module-id"],
        undefined
      )
    }).toThrow(ListenersInputError)
  })

  test("Exclude 2 modules with valid ids", () => {
    const [_config, _threshold, listenerModulesFiltered] = validateInput(
      undefined,
      '{"inline": "configuration"}',
      undefined,
      listenerModules,
      ["heart-test1", "heart-test2"],
      undefined
    )

    expect(listenerModulesFiltered).toHaveLength(0)
  })
})
