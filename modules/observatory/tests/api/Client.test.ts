import { ObservatoryConfig, ObservatoryResult } from "@fabernovel/heart-common"
import { jest } from "@jest/globals"

const ANALYZE_URL = "www.observatory.mozilla/results"
const API_URL = "www.observatory.mozilla/api"
const RESULT: ObservatoryResult = {
  "content-security-policy": {
    expectation: "csp-implemented-with-no-unsafe",
    name: "content-security-policy",
    output: {
      data: {},
    },
    pass: false,
    result: "csp-implemented-with-unsafe-inline-in-style-src-only",
    score_description:
      "Content Security Policy (CSP) implemented with unsafe-inline inside style-src directive",
    score_modifier: -5,
  },
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
