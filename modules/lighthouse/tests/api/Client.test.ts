import { jest } from "@jest/globals"
import type { RunnerResult } from "lighthouse"
import { Conf } from "../data/Conf.js"

const RUNNER_RESULT = {
  lhr: {
    categories: {
      category1: { score: 67 },
      category2: { score: 74 },
      category3: { score: 95 },
      category4: { score: 88 },
      category5: { score: 53 },
    },
  },
} as unknown as RunnerResult // avoid the declaration of a huuuuuge object

jest.unstable_mockModule("lighthouse", () => ({
  default: jest.fn().mockImplementationOnce(() => Promise.resolve(RUNNER_RESULT)),
}))
await import("lighthouse")

const { requestResult } = await import("../../src/api/Client.js")

describe("Run an analysis", () => {
  it("should runs an analysis with a valid configuration", async () => {
    const results = await requestResult(Conf, false)
    expect(results).toStrictEqual(RUNNER_RESULT.lhr)
  })
})
