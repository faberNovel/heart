import type { ObservatoryConfig } from "@fabernovel/heart-common"
import { jest } from "@jest/globals"
import { RESULT } from "../data/Result.js"

const ANALYZE_URL = "www.observatory.mozilla/results"
const API_URL = "www.observatory.mozilla/api"

jest.unstable_mockModule("@fabernovel/heart-common", () => ({
  ObservatoryReport: {},
  Request: {
    get: jest.fn(() => Promise.resolve(RESULT)),
    post: jest.fn(() => Promise.resolve(RESULT)),
  },
}))
await import("@fabernovel/heart-common")
const { Client } = await import("../../src/api/Client.js")

describe("Client", () => {
  process.env.OBSERVATORY_ANALYZE_URL = ANALYZE_URL
  process.env.OBSERVATORY_API_URL = API_URL

  test("Analyze with valid configuration", async () => {
    const CONF = { host: "www.website.test" }

    const client = new Client()

    const scan = await client.triggerAnalysis(CONF)

    expect(scan).toStrictEqual(RESULT)
    expect(client.getAnalyzeUrl()).toBe(ANALYZE_URL + CONF.host)
  })

  test("Analyze with invalid configuration", async () => {
    const CONF = {} as ObservatoryConfig

    const client = new Client()

    try {
      await client.triggerAnalysis(CONF)
    } catch (e) {
      expect(e).toHaveProperty("error")
    }
  })
})
