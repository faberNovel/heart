import { jest } from "@jest/globals"
import type { RunnerResult } from "lighthouse"
import { Conf } from "../data/Conf.js"

jest.useFakeTimers()

jest.unstable_mockModule("lighthouse", () => ({
  default: jest.fn(),
}))
const lighthouse = (await import("lighthouse")).default
const mockedLighthouse = jest.mocked(lighthouse)

const { requestResult } = await import("../../src/api/Client.js")

describe("Run an analysis", () => {
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

  it("should runs an analysis with a valid configuration", async () => {
    mockedLighthouse.mockResolvedValue(RUNNER_RESULT)

    const results = await requestResult(Conf, false)
    expect(results).toStrictEqual(RUNNER_RESULT.lhr)
  })
})
