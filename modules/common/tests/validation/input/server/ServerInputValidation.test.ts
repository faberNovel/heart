import { InputError } from "../../../../src/error/InputError.js"
import { validateServerInput } from "../../../../src/validation/input/server/ServerInputValidation.js"

describe("Valid cors value", () => {
  test("origin property with a string value", () => {
    const options = { cors: { origin: "http://127.0..0.1:8080/" } }
    const validatedData = validateServerInput(options)

    expect(validatedData).toBe(options)
  })

  test("origin property with a boolean value", () => {
    const options = { cors: { origin: true } }
    const validatedData = validateServerInput(options)

    expect(validatedData).toBe(options)
  })

  test("origin property with an string[] value", () => {
    const options = { cors: { origin: ["http://127.0..0.1:8080/", "http://127.0..0.1:8888/"] } }
    const validatedData = validateServerInput(options)

    expect(validatedData).toBe(options)
  })

  test("credentials property with a boolean value", () => {
    const options = { cors: { credentials: true } }
    const validatedData = validateServerInput(options)

    expect(validatedData).toBe(options)
  })

  test("exposedHeaders property with a string value", () => {
    const options = { cors: { exposedHeaders: "Content-Range,X-Content-Range" } }
    const validatedData = validateServerInput(options)

    expect(validatedData).toBe(options)
  })

  test("exposedHeaders property with an string[] value", () => {
    const options = { cors: { exposedHeaders: ["Content-Range", "X-Content-Range"] } }
    const validatedData = validateServerInput(options)

    expect(validatedData).toBe(options)
  })

  test("allowedHeaders property with a string value", () => {
    const options = { cors: { allowedHeaders: "Content-Type,Authorization" } }
    const validatedData = validateServerInput(options)

    expect(validatedData).toBe(options)
  })

  test("allowedHeaders property with an string[] value", () => {
    const options = { cors: { allowedHeaders: ["Content-Type", "Authorization"] } }
    const validatedData = validateServerInput(options)

    expect(validatedData).toBe(options)
  })

  test("methods property with a string value", () => {
    const options = { cors: { methods: "GET,PUT,POST" } }
    const validatedData = validateServerInput(options)

    expect(validatedData).toBe(options)
  })

  test("methods property with an string[] value", () => {
    const options = { cors: { methods: ["GET", "PUT", "POST"] } }
    const validatedData = validateServerInput(options)

    expect(validatedData).toBe(options)
  })

  test("preflightContinue property with a boolean value", () => {
    const options = { cors: { preflightContinue: true } }
    const validatedData = validateServerInput(options)

    expect(validatedData).toBe(options)
  })

  test("preflight property with a boolean value", () => {
    const options = { cors: { preflight: true } }
    const validatedData = validateServerInput(options)

    expect(validatedData).toBe(options)
  })

  test("strictPreflight property with a boolean value", () => {
    const options = { cors: { strictPreflight: true } }
    const validatedData = validateServerInput(options)

    expect(validatedData).toBe(options)
  })

  test("hideOptionsRoute property with a boolean value", () => {
    const options = { cors: { hideOptionsRoute: true } }
    const validatedData = validateServerInput(options)

    expect(validatedData).toBe(options)
  })
})

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
