import { InputError } from "../../../../src/error/InputError.js"
import { validateServerInput } from "../../../../src/validation/input/server/ServerInputValidation.js"

// describe("Invalid configuration value", () => {
//   test("Array", () => {
//     expect(() => {
//       validateServerInput({ config: [] })
//     }).toThrow(InputError)
//   })

//   test("Empty JSON object", () => {
//     expect(() => {
//       validateServerInput({ config: {} })
//     }).toThrow(InputError)
//   })

//   test("Number", () => {
//     expect(() => {
//       validateServerInput({ config: 2 })
//     }).toThrow(InputError)
//   })

//   test("String", () => {
//     expect(() => {
//       validateServerInput({ config: "" })
//     }).toThrow(InputError)
//   })
// })

describe("Invalid port value", () => {
  test("Array", () => {
    expect(() => {
      validateServerInput({
        port: [],
      })
    }).toThrow(InputError)
  })

  test("JSON object", () => {
    expect(() => {
      validateServerInput({
        port: {},
      })
    }).toThrow(InputError)
  })

  test("Number < 0", () => {
    expect(() => {
      validateServerInput({
        port: -1,
      })
    }).toThrow(InputError)
  })

  test("Number > 65535", () => {
    expect(() => {
      validateServerInput({
        port: 65536,
      })
    }).toThrow(InputError)
  })

  test("String", () => {
    expect(() => {
      validateServerInput({
        port: "",
      })
    }).toThrow(InputError)
  })
})
