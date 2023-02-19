import { LighthouseResult } from "@fabernovel/heart-core"
import { jest } from "@jest/globals"
import { Conf } from "./data/Conf.js"

const RESULT = {
  categories: {
    category1: { score: 0.95 },
    category2: { score: 0.9 },
    category3: { score: 0.95 },
    category4: { score: 0.9 },
    category5: { score: 0.8 },
  },
  requestedUrl: Conf.url,
  fetchTime: 1584540399,
} as unknown as LighthouseResult // avoid the declaration of a huuuuuge object

jest.unstable_mockModule("../src/api/Client.js", () => ({
  requestResult: jest.fn<() => Promise<LighthouseResult>>().mockResolvedValue(RESULT),
}))
const { requestResult } = await import("../src/api/Client.js")
const mockedRequestResult = jest.mocked(requestResult)

const { LighthouseModule } = await import("../src/LighthouseModule.js")

describe("Starts an analysis", () => {
  const module = new LighthouseModule({
    name: "Heart Lighthouse Test",
    service: {
      name: "Lighthouse Test",
    },
  })

  it("should starts an analysis with a valid configuration", async () => {
    // mock the analysis stuff
    mockedRequestResult.mockResolvedValue(RESULT)

    const report = await module.startAnalysis(Conf)

    expect(report.analyzedUrl).toStrictEqual(Conf.url)
    expect(report).toHaveProperty("date")
    expect(report).toHaveProperty("note")
    expect(report).toHaveProperty("normalizedNote")
  })

  it("should starts an analysis with an invalid configuration", async () => {
    Conf.url = ""
    try {
      await module.startAnalysis(Conf)
    } catch (e) {
      expect(e).toHaveProperty("error")
    }
  })

  it("Should return true status when results match thresholds objectives", async () => {
    const THRESHOLD = 80

    //mock the analysis stuff
    mockedRequestResult.mockResolvedValue(RESULT)

    const report = await module.startAnalysis(Conf, THRESHOLD)

    expect(report.isThresholdReached()).toStrictEqual(true)
  })
})