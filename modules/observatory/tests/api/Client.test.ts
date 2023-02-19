import { ObservatoryConfig, ObservatoryResult } from "@fabernovel/heart-common"
import { jest } from "@jest/globals"

const ANALYZE_URL = "www.observatory.mozilla/results"
const API_URL = "www.observatory.mozilla/api"
const RESULT: ObservatoryResult = {
  end_time: "",
  grade: "B",
  hidden: true,
  response_headers: {},
  scan_id: 1,
  score: 95,
  likelihood_indicator: "",
  start_time: "",
  state: "FINISHED",
  tests_failed: 3,
  tests_passed: 4,
  tests_quantity: 12,
}

jest.unstable_mockModule("@fabernovel/heart-common", () => ({
  Request: {
    get: () => Promise.resolve(RESULT),
    post: () => Promise.resolve(RESULT),
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

    const scan = await client.launchAnalysis(CONF)

    expect(scan).toStrictEqual(RESULT)
    expect(client.getProjectHost()).toBe(CONF.host)
    expect(client.getAnalyzeUrl()).toBe(ANALYZE_URL + CONF.host)
  })

  test("Analyze with invalid configuration", async () => {
    const CONF = {} as ObservatoryConfig

    const client = new Client()

    try {
      await client.launchAnalysis(CONF)
    } catch (e) {
      expect(e).toHaveProperty("error")
    }
  })
})
