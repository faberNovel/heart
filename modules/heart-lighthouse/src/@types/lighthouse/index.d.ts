/* eslint-disable @typescript-eslint/no-empty-interface, @typescript-eslint/no-explicit-any */
declare module 'lighthouse' {
  type Locale = 'en-US'|'en'|'en-AU'|'en-GB'|'en-IE'|'en-SG'|'en-ZA'|'en-IN'|'ar-XB'|'ar'|'bg'|'bs'|'ca'|'cs'|'da'|'de'|'el'|'en-XA'|'en-XL'|'es'|'es-419'|'es-AR'|'es-BO'|'es-BR'|'es-BZ'|'es-CL'|'es-CO'|'es-CR'|'es-CU'|'es-DO'|'es-EC'|'es-GT'|'es-HN'|'es-MX'|'es-NI'|'es-PA'|'es-PE'|'es-PR'|'es-PY'|'es-SV'|'es-US'|'es-UY'|'es-VE'|'fi'|'fil'|'fr'|'he'|'hi'|'hr'|'hu'|'gsw'|'id'|'in'|'it'|'iw'|'ja'|'ko'|'ln'|'lt'|'lv'|'mo'|'nl'|'nb'|'no'|'pl'|'pt'|'pt-PT'|'ro'|'ru'|'sk'|'sl'|'sr'|'sr-Latn'|'sv'|'ta'|'te'|'th'|'tl'|'tr'|'uk'|'vi'|'zh'|'zh-HK'|'zh-TW'
  
  type OutputMode = 'json' | 'html' | 'csv'
  
  /** Simulation settings that control the amount of network & cpu throttling in the run. */
  interface ThrottlingSettings {
    /** The round trip time in milliseconds. */
    rttMs?: number
    /** The network throughput in kilobits per second. */
    throughputKbps?: number
    // devtools settings
    /** The network request latency in milliseconds. */
    requestLatencyMs?: number
    /** The network download throughput in kilobits per second. */
    downloadThroughputKbps?: number
    /** The network upload throughput in kilobits per second. */
    uploadThroughputKbps?: number
    // used by both
    /** The amount of slowdown applied to the cpu (1/<cpuSlowdownMultiplier>). */
    cpuSlowdownMultiplier?: number
  }
  
  interface PrecomputedLanternData {
    additionalRttByOrigin: {[origin: string]: number}
    serverResponseTimeByOrigin: {[origin: string]: number}
  }
  
  /**
  * Options that are found in both the flags used by the Lighthouse module
  * interface and the Config's `settings` object.
  */
  interface SharedFlagsSettings {
    /** The type(s) of report output to be produced. */
    output?: OutputMode|OutputMode[]
    /** The locale to use for the output. */
    locale?: Locale
    /** The maximum amount of time to wait for a page content render, in ms. If no content is rendered within this limit, the run is aborted with an error. */
    maxWaitForFcp?: number
    /** The maximum amount of time to wait for a page to load, in ms. */
    maxWaitForLoad?: number
    /** List of URL patterns to block. */
    blockedUrlPatterns?: string[] | null
    /** Comma-delimited list of trace categories to include. */
    additionalTraceCategories?: string | null
    /** Flag indicating the run should only audit. */
    auditMode?: boolean | string
    /** Flag indicating the run should only gather. */
    gatherMode?: boolean | string
    /** Flag indicating that the browser storage should not be reset for the audit. */
    disableStorageReset?: boolean
    /** The form factor the emulation should use. */
    emulatedFormFactor?: 'mobile'|'desktop'|'none'
    /** The method used to throttle the network. */
    throttlingMethod?: 'devtools'|'simulate'|'provided'
    /** The throttling config settings. */
    throttling?: ThrottlingSettings
    /** If present, the run should only conduct this list of audits. */
    onlyAudits?: string[] | null
    /** If present, the run should only conduct this list of categories. */
    onlyCategories?: string[] | null
    /** If present, the run should skip this list of audits. */
    skipAudits?: string[] | null
    /** List of extra HTTP Headers to include. */
    // extraHeaders?: Crdp.Network.Headers | null // See extraHeaders TODO in bin.js
    /** How Lighthouse was run, e.g. from the Chrome extension or from the npm module */
    channel?: string
    /** Precomputed lantern estimates to use instead of observed analysis. */
    precomputedLanternData?: PrecomputedLanternData | null
  }
  
  interface RunnerResult {
    lhr: Result
  }
  
  /**
  * The full output of a Lighthouse run.
  */
  interface Result {
    /** The URL that was supplied to Lighthouse and initially navigated to. */
    requestedUrl: string
    /** The post-redirects URL that Lighthouse loaded. */
    finalUrl: string
    /** The ISO-8601 timestamp of when the results were generated. */
    fetchTime: string
    /** The version of Lighthouse with which these results were generated. */
    lighthouseVersion: string
    /** An object containing the results of the audits, keyed by the audits' `id` identifier. */
    audits: Record<string, Audit.Result>
    /** The top-level categories, their overall scores, and member audits. */
    categories: Record<string, Result.Category>
    /** Descriptions of the groups referenced by CategoryMembers. */
    categoryGroups?: Record<string, Result.ReportGroup>
    
    /** The config settings used for these results. */
    configSettings: Config.Settings
    /** List of top-level warnings for this Lighthouse run. */
    runWarnings: string[]
    /** A top-level error message that, if present, indicates a serious enough problem that this Lighthouse result may need to be discarded. */
    runtimeError?: {code: string, message: string}
    /** The User-Agent string of the browser used run Lighthouse for these results. */
    userAgent: string
    /** Information about the environment in which Lighthouse was run. */
    environment: Environment
    /** Execution timings for the Lighthouse run */
    timing: Result.Timing
    /** The record of all formatted string locations in the LHR and their corresponding source values. */
    i18n: {rendererFormattedStrings: I18NRendererStrings, icuMessagePaths: I18NMessages}
    /** An array containing the result of all stack packs. */
    stackPacks?: Result.StackPack[]
  }
  
  interface I18NRendererStrings {
    [varName: string]: string
  }
  
  type I18NMessageValuesEntry = {path: string, values:  Record<string, string | number>}
  type I18NMessageEntry = string | I18NMessageValuesEntry
  
  interface I18NMessages {
    [icuMessageId: string]: I18NMessageEntry[]
  }
  
  interface Environment {
    /** The user agent string of the version of Chrome used. */
    hostUserAgent: string
    /** The user agent string that was sent over the network. */
    networkUserAgent: string
    /** The benchmark index number that indicates rough device class. */
    benchmarkIndex: number
  }
  
  interface Flags extends SharedFlagsSettings {
    /** The port to use for the debugging protocol, if manually connecting. */
    port?: number
    /** The hostname to use for the debugging protocol, if manually connecting. */
    hostname?: string
    /** The level of logging to enable. */
    logLevel?: 'silent'|'error'|'info'|'verbose'
    /** The path to the config JSON. */
    configPath?: string
    /** Run the specified plugins. */
    plugins?: string[]
  }
  
  namespace Audit {
    /* Audit result returned in Lighthouse report. All audits offer a description and score of 0-1. */
    interface Result {
      displayValue?: string
      /** An explanation of why the audit failed on the test page. */
      explanation?: string
      /** Error message from any exception thrown while running this audit. */
      errorMessage?: string
      warnings?: string[]
      /** The scored value of the audit, provided in the range `0-1`, or null if `scoreDisplayMode` indicates not scored. */
      score: number|null
      /**
      * A string identifying how the score should be interpreted:
      * 'binary': pass/fail audit (0 and 1 are only possible scores).
      * 'numeric': scores of 0-1 (map to displayed scores of 0-100).
      * 'informative': the audit is an FYI only, and can't be interpreted as pass/fail. Score is null and should be ignored.
      * 'notApplicable': the audit turned out to not apply to the page. Score is null and should be ignored.
      * 'manual': The audit exists only to tell you to review something yourself. Score is null and should be ignored.
      * 'error': There was an error while running the audit (check `errorMessage` for details). Score is null and should be ignored.
      */
      scoreDisplayMode: ScoreDisplayMode
      /** Short, user-visible title for the audit. The text can change depending on if the audit passed or failed. */
      title: string
      /** The string identifier of the audit, in kebab case. */
      id: string
      /** A more detailed description that describes why the audit is important and links to Lighthouse documentation on the audit markdown links supported. */
      description: string
      /** A numeric value that has a meaning specific to the audit, e.g. the number of nodes in the DOM or the timestamp of a specific load event. More information can be found in the audit details, if present. */
      numericValue?: number
    }
    
    interface ScoreDisplayModes {
      /** Scores of 0-1 (map to displayed scores of 0-100). */
      NUMERIC: 'numeric'
      /** Pass/fail audit (0 and 1 are only possible scores). */
      BINARY: 'binary'
      /** The audit exists only to tell you to review something yourself. Score is null and should be ignored. */
      MANUAL: 'manual'
      /** The audit is an FYI only, and can't be interpreted as pass/fail. Score is null and should be ignored. */
      INFORMATIVE: 'informative'
      /** The audit turned out to not apply to the page. Score is null and should be ignored. */
      NOT_APPLICABLE: 'notApplicable'
      /** There was an error while running the audit (check `errorMessage` for details). Score is null and should be ignored. */
      ERROR: 'error'
    }
    
    type ScoreDisplayMode = Audit.ScoreDisplayModes[keyof Audit.ScoreDisplayModes]
  }
  
  namespace Config {
    /**
    * The pre-normalization Lighthouse Config format.
    */
    interface Json {
      extends?: 'lighthouse:default' | 'lighthouse:full' | string | boolean
      settings?: SharedFlagsSettings
      passes?: PassJson[] | null
      categories?: Record<string, CategoryJson> | null
      groups?: Record<string, Config.GroupJson> | null
      plugins?: Array<string>,
    }
    
    interface PassJson {
      passName: string
      recordTrace?: boolean
      useThrottling?: boolean
      pauseAfterLoadMs?: number
      networkQuietThresholdMs?: number
      cpuQuietThresholdMs?: number
      blockedUrlPatterns?: string[]
      blankPage?: string
    }
    
    interface CategoryJson {
      title: string
      auditRefs: AuditRefJson[]
      description?: string
      manualDescription?: string
    }
    
    interface GroupJson {
      title: string
      description?: string
    }
    
    /**
    * Reference to an audit member of a category and how its score should be
    * weighted and how its results grouped with other members.
    */
    interface AuditRefJson {
      id: string
      weight: number
      group?: string
    }
    
    interface Settings extends Required<SharedFlagsSettings> {
      throttling: Required<ThrottlingSettings>
    }
    
    interface AuditRef extends AuditRefJson {}
    interface Category extends CategoryJson {
      auditRefs: AuditRef[]
    }
    interface Group extends GroupJson {}
    
    interface Plugin {
      /** Optionally provide more audits to run in addition to those specified by the base config. */
      audits?: Array<{path: string}>
      /** Provide a category to display the plugin results in the report. */
      category: Config.Category
      /** Optionally provide more groups in addition to those specified by the base config. */
      groups?: Record<string, Config.GroupJson>
    }
    
    type MergeOptionsOfItems = <T extends {path?: string, options: Record<string, any>}>(items: T[]) => T[]
    
    type Merge = {
      <T extends Record<string, any>, U extends Record<string, any>>(base: T|null|undefined, extension: U, overwriteArrays?: boolean): T & U
      <T extends Array<any>, U extends Array<any>>(base: T|null|undefined, extension: T, overwriteArrays?: boolean): T & U
    }
  }
  
  namespace Result {
    interface Timing {
      total: number
    }
    
    interface Category {
      /** The string identifier of the category. */
      id: string
      /** The human-friendly name of the category */
      title: string
      /** A more detailed description of the category and its importance. */
      description?: string
      /** A description for the manual audits in the category. */
      manualDescription?: string
      /** The overall score of the category, the weighted average of all its audits. */
      score: number|null
      /** An array of references to all the audit members of this category. */
      auditRefs: AuditRef[]
    }
    
    interface AuditRef {
      /** Matches the `id` of an Audit.Result. */
      id: string
      /** The weight of the audit's score in the overall category score. */
      weight: number
      /** Optional grouping within the category. Matches the key of a Result.Group. */
      group?: string
    }
    
    interface ReportGroup {
      /** The title of the display group. */
      title: string
      /** A brief description of the purpose of the display group. */
      description?: string
    }
    
    /**
    * A pack of secondary audit descriptions to be used when a page uses a
    * specific technology stack, giving stack-specific advice for some of
    * Lighthouse's audits.
    */
    interface StackPack {
      /** The unique string ID for this stack pack. */
      id: string
      /** The title of the stack pack, to be displayed in the report. */
      title: string
      /** A base64 data url to be used as the stack pack's icon. */
      iconDataURL: string
      /** A set of descriptions for some of Lighthouse's audits, keyed by audit `id`. */
      descriptions: Record<string, string>
    }
  }
}