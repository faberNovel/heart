/**
* Simplified version of the Lighthouse types, as the type definition is far from complete
*/
declare module 'lighthouse/lighthouse-core' {
  import { Config, Flags, RunnerResult } from 'lighthouse'
  
  /**
  * Run Lighthouse.
  * @param {string} url The URL to test. Optional if running in auditMode.
  * @param {LH.Flags} flags Optional settings for the Lighthouse run. If present,
  *   they will override any settings in the config.
  * @param {LH.Config.Json} configJSON Configuration for the Lighthouse run. If
  *   not present, the default config is used.
  * @return {Promise<LH.RunnerResult|undefined>}
  */
  function lighthouse(url?: string, flags?: Flags, configJSON?: Config.Json): Promise<RunnerResult | undefined>
  
  export = lighthouse
}