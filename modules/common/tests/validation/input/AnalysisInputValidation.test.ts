import {
  ConfigInputError,
  ListenersInputError,
  ModuleListenerInterface,
  validateAnalysisInput,
} from "../../../src/index.js"

describe("Provide invalid configurations", () => {
  test("No configurations", () => {
    expect(() => {
      validateAnalysisInput(undefined, undefined, undefined, [], undefined, undefined)
    }).toThrow(ConfigInputError)
  })

  test("Two configurations", () => {
    expect(() => {
      validateAnalysisInput("", "", undefined, [], undefined, undefined)
    }).toThrow(ConfigInputError)
  })

  test("Wrong inline configuration format", () => {
    expect(() => {
      validateAnalysisInput(undefined, 4, undefined, [], undefined, undefined)
    }).toThrow(ConfigInputError)
  })

  test("Wrong file configuration format", () => {
    expect(() => {
      validateAnalysisInput(4, undefined, undefined, [], undefined, undefined)
    }).toThrow(ConfigInputError)
  })

  test("Inexistant file", () => {
    expect(() => {
      validateAnalysisInput("missingConfig.json", undefined, undefined, [], undefined, undefined)
    }).toThrow(ConfigInputError)
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
        undefined,
        { inline: "configuration" },
        undefined,
        listenerModulesIds,
        ["invalid-module-id"],
        undefined
      )
    }).toThrow(ListenersInputError)
  })

  test("Exclude 2 modules but set an invalid id for one of them", () => {
    expect(() => {
      validateAnalysisInput(
        undefined,
        { inline: "configuration" },
        undefined,
        listenerModulesIds,
        ["heart-test1", "invalid-module-id"],
        undefined
      )
    }).toThrow(ListenersInputError)
  })

  test("Keep only 1 module with an invalid id", () => {
    expect(() => {
      validateAnalysisInput(
        undefined,
        { inline: "configuration" },
        undefined,
        listenerModulesIds,
        undefined,
        ["invalid-module-id"]
      )
    }).toThrow(ListenersInputError)
  })

  test("Keep 2 modules but set an invalid id for one of them", () => {
    expect(() => {
      validateAnalysisInput(
        undefined,
        { inline: "configuration" },
        undefined,
        listenerModulesIds,
        undefined,
        ["heart-test1", "invalid-module-id"]
      )
    }).toThrow(ListenersInputError)
  })
})
