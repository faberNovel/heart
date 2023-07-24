import { InputError } from "../../../../src/error/InputError.js"
import type { ModuleListenerInterface } from "../../../../src/module/listener/ModuleListenerInterface.js"
import { validateAnalysisInput } from "../../../../src/validation/input/analysis/AnalysisInputValidation.js"

describe("Invalid option combinations", () => {
  test("Missing configuration", () => {
    expect(() => {
      validateAnalysisInput({})
    }).toThrow(InputError)
  })

  test("Both listener options", () => {
    expect(() => {
      validateAnalysisInput({
        config: { inline: "configuration" },
        except_listeners: [],
        only_listeners: [],
      })
    }).toThrow(InputError)
  })
})

describe("Invalid configuration value", () => {
  test("Array", () => {
    expect(() => {
      validateAnalysisInput({ config: [] })
    }).toThrow(InputError)
  })

  test("Empty JSON object", () => {
    expect(() => {
      validateAnalysisInput({ config: {} })
    }).toThrow(InputError)
  })

  test("Number", () => {
    expect(() => {
      validateAnalysisInput({ config: 2 })
    }).toThrow(InputError)
  })

  test("String", () => {
    expect(() => {
      validateAnalysisInput({ config: "" })
    }).toThrow(InputError)
  })
})

describe("Invalid threshold value", () => {
  test("Array", () => {
    expect(() => {
      validateAnalysisInput({
        config: { inline: "configuration" },
        threshold: [],
      })
    }).toThrow(InputError)
  })

  test("JSON object", () => {
    expect(() => {
      validateAnalysisInput({
        config: { inline: "configuration" },
        threshold: {},
      })
    }).toThrow(InputError)
  })

  test("Number < 0", () => {
    expect(() => {
      validateAnalysisInput({
        config: { inline: "configuration" },
        threshold: -1,
      })
    }).toThrow(InputError)
  })

  test("Number > 100", () => {
    expect(() => {
      validateAnalysisInput({
        config: { inline: "configuration" },
        threshold: 101,
      })
    }).toThrow(InputError)
  })

  test("String", () => {
    expect(() => {
      validateAnalysisInput({
        config: { inline: "configuration" },
        threshold: "",
      })
    }).toThrow(InputError)
  })
})

describe("Invalid listener options value", () => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const notifyAnalysisDone = () => new Promise(() => {})

  const listenerModules: ModuleListenerInterface[] = [
    {
      id: "heart-test1",
      type: "listener",
      name: "Heart Test1",
      service: { name: "Test1" },
      notifyAnalysisDone: notifyAnalysisDone,
    },
    {
      id: "heart-test2",
      type: "listener",
      name: "Heart Test2",
      service: { name: "Test2" },
      notifyAnalysisDone: notifyAnalysisDone,
    },
  ]
  const listenerModulesIds = listenerModules.map((listenerModule) => listenerModule.id)

  test("Exclude 1 module with an invalid id", () => {
    expect(() => {
      validateAnalysisInput(
        {
          config: { inline: "configuration" },
          except_listeners: ["invalid-module-id"],
        },
        listenerModulesIds
      )
    }).toThrow(InputError)
  })

  test("Exclude 2 modules but set an invalid id for one of them", () => {
    expect(() => {
      validateAnalysisInput(
        {
          config: { inline: "configuration" },
          except_listeners: ["heart-test1", "invalid-module-id"],
        },
        listenerModulesIds
      )
    }).toThrow(InputError)
  })

  test("Keep only 1 module with an invalid id", () => {
    expect(() => {
      validateAnalysisInput(
        {
          config: { inline: "configuration" },
          only_listeners: ["invalid-module-id"],
        },
        listenerModulesIds
      )
    }).toThrow(InputError)
  })

  test("Keep 2 modules but set an invalid id for one of them", () => {
    expect(() => {
      validateAnalysisInput(
        {
          config: { inline: "configuration" },
          only_listeners: ["heart-test1", "invalid-module-id"],
        },
        listenerModulesIds
      )
    }).toThrow(InputError)
  })
})
