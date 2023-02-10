import childProcess from "child_process"
import * as chromeLauncher from "chrome-launcher"
import lighthouse, { RunnerResult } from "lighthouse"
import { requestResult } from "../../src/api/Client.js"
import { Conf } from "../data/Conf.js"

jest.mock("child_process")
jest.mock("chrome-launcher")
jest.mock("lighthouse")
const mockedLighthouse = jest.mocked(lighthouse)
const mockChromeLauncherLaunch = jest.mocked(chromeLauncher.launch)
mockChromeLauncherLaunch.mockResolvedValue({
  pid: 1111,
  port: 1234,
  process: childProcess.spawn("ls"),
  kill: () => Promise.resolve(),
})

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
    // mock chrome-launcher and lighthouse modules methods
    mockedLighthouse.mockResolvedValue(RUNNER_RESULT)

    const results = await requestResult(Conf)
    expect(results).toStrictEqual(RUNNER_RESULT.lhr)
  })
})
