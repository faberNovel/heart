import { ObservatoryScanState, type ObservatoryReport } from "@fabernovel/heart-common"

export const RESULT: ObservatoryReport["result"] = {
  scan: {
    end_time: "May 13, 2022 5:58 PM",
    grade: "B",
    hidden: true,
    response_headers: {},
    scan_id: 1,
    score: 95,
    likelihood_indicator: "",
    start_time: "",
    state: ObservatoryScanState.FINISHED,
    tests_failed: 3,
    tests_passed: 4,
    tests_quantity: 12,
  },
  tests: {
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
  },
}
