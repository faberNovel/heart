/**
 * The tests object contains one test object for each test conducted by the HTTP Observatory
 * https://github.com/mozilla/http-observatory/blob/master/httpobs/docs/api.md#tests
 */
type TestsResult = Record<string, TestResult>;

export default TestsResult;

export interface TestResult {

  /**
   * The expectation for a test result going in
   */
  expectation: string;

  /**
   * The name of the test; this should be the same as the parent object's name
   */
  name: string;

  /**
   * Artifacts related to the test; these can vary widely between tests and are not guaranteed to be stable over time
   */
  output: {
    /**
     * Data is generally as close to the raw output of the test as is possible.
     * For example, in the strict-transport-security test, output -> data contains the raw Strict-Transport-Security header
     */
    data?: any;

    /**
     * other values under output have keys that vary;
     * for example, the strict-transport-security test has a includeSubDomains key that is either set to True or False.
     * Similarly, the redirection test contains a route key that contains an array of the URLs that were redirected to.
     * See example for more available keys.
     * https://github.com/mozilla/http-observatory/blob/master/httpobs/docs/api.md#tests
     */
    [key: string]: any;
  };

  /**
   * Whether the test passed or failed; a test that meets or exceeds the expectation will be marked as passed
   */
  pass: boolean;

  /**
   * Result of the test
   */
  result: string;

  /**
   * Short description describing what result means
   */
  score_description: string;

  /**
   * How much the result of the test affected the final score; should range between +5 and -50
   */
  score_modifier: number;

}
