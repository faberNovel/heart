/**
 * @see {@link https://github.com/mozilla/http-observatory/blob/master/httpobs/docs/api.md#tests}
 */
export type Tests = Record<
  string,
  {
    // the expectation for a test result going in
    expectation: string

    // the name of the test; this should be the same as the parent object's name
    name: string

    // artifacts related to the test; these can vary widely between tests and are not guaranteed to be stable over time.
    output: {
      // generally as close to the raw output of the test as is possible. For example, in the strict-transport-security test, output -> data contains the raw Strict-Transport-Security header
      data: Record<string, string[]>

      // ???? other values under output have keys that vary; for example, the strict-transport-security test has a includeSubDomains key that is either set to True or False. Similarly, the redirection test contains a route key that contains an array of the URLs that were redirected to. See example below for more available keys.
      [key: string]: object
    }

    // whether the test passed or failed; a test that meets or exceeds the expectation will be marked as passed
    pass: boolean

    // result of the test
    result: string

    // short description describing what result means
    score_description: string

    // how much the result of the test affected the final score; should range between +5 and -50
    score_modifier: number
  }
>
