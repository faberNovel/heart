import { InputError, ModuleListenerInterface, validateAnalysisInput } from "../../../src/index.js"

describe("Validate invalid configuration", () => {
  test("Empty string as configuration", () => {
    expect(() => {
      validateAnalysisInput([], "", undefined, undefined, undefined)
    }).toThrow(InputError)
  })

  test("Number as configuration", () => {
    expect(() => {
      validateAnalysisInput([], 2, undefined, undefined, undefined)
    }).toThrow(InputError)
  })

  test("Empty JSON object as configuration", () => {
    expect(() => {
      validateAnalysisInput([], {}, undefined, undefined, undefined)
    }).toThrow(InputError)
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
  const listenerModulesIds = listenerModules.map((listenerModule) => listenerModule.id)

  test("Exclude 1 module with an invalid id", () => {
    expect(() => {
      validateAnalysisInput(
        listenerModulesIds,
        { inline: "configuration" },
        undefined,
        ["invalid-module-id"],
        undefined
      )
    }).toThrow(InputError)
  })

  test("Exclude 2 modules but set an invalid id for one of them", () => {
    expect(() => {
      validateAnalysisInput(
        listenerModulesIds,
        { inline: "configuration" },
        undefined,
        ["heart-test1", "invalid-module-id"],
        undefined
      )
    }).toThrow(InputError)
  })

  test("Keep only 1 module with an invalid id", () => {
    expect(() => {
      validateAnalysisInput(listenerModulesIds, { inline: "configuration" }, undefined, undefined, [
        "invalid-module-id",
      ])
    }).toThrow(InputError)
  })

  test("Keep 2 modules but set an invalid id for one of them", () => {
    expect(() => {
      validateAnalysisInput(listenerModulesIds, { inline: "configuration" }, undefined, undefined, [
        "heart-test1",
        "invalid-module-id",
      ])
    }).toThrow(InputError)
  })
})
