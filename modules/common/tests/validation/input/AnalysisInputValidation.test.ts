import { InputError, ModuleListenerInterface, validateAnalysisInput } from "../../../src/index.js"

describe("Validate invalid configuration", () => {
  test("Empty string as configuration", () => {
    expect(() => {
      validateAnalysisInput([], { config: "" })
    }).toThrow(InputError)
  })

  test("Number as configuration", () => {
    expect(() => {
      validateAnalysisInput([], { config: 2 })
    }).toThrow(InputError)
  })

  test("Empty JSON object as configuration", () => {
    expect(() => {
      validateAnalysisInput([], { config: {} })
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
      validateAnalysisInput(listenerModulesIds, {
        config: { inline: "configuration" },
        except_listeners: ["invalid-module-id"],
      })
    }).toThrow(InputError)
  })

  test("Exclude 2 modules but set an invalid id for one of them", () => {
    expect(() => {
      validateAnalysisInput(listenerModulesIds, {
        config: { inline: "configuration" },
        except_listeners: ["heart-test1", "invalid-module-id"],
      })
    }).toThrow(InputError)
  })

  test("Keep only 1 module with an invalid id", () => {
    expect(() => {
      validateAnalysisInput(listenerModulesIds, {
        config: { inline: "configuration" },
        only_listeners: ["invalid-module-id"],
      })
    }).toThrow(InputError)
  })

  test("Keep 2 modules but set an invalid id for one of them", () => {
    expect(() => {
      validateAnalysisInput(listenerModulesIds, {
        config: { inline: "configuration" },
        only_listeners: ["heart-test1", "invalid-module-id"],
      })
    }).toThrow(InputError)
  })

  test("Use both options", () => {
    expect(() => {
      validateAnalysisInput(listenerModulesIds, {
        config: { inline: "configuration" },
        except_listeners: [],
        only_listeners: [],
      })
    }).toThrow(InputError)
  })
})
