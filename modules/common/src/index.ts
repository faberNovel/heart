import { ConfigError } from "./error/ConfigError.js"
import { ThresholdError } from "./error/ThresholdError.js"
import { Request } from "./http/Request.js"
import type { Config } from "./module/analysis/input/Config.js"
import type { GreenITConfig } from "./module/analysis/input/greenit/GreeenITConfig.js"
import type { LighthouseConfig } from "./module/analysis/input/lighthouse/LighthouseConfig.js"
import type { ObservatoryConfig } from "./module/analysis/input/observatory/ObservatoryConfig.js"
import type { SsllabsServerConfig } from "./module/analysis/input/ssllabs-server/SsllabsServerConfig.js"
import { Module } from "./module/Module.js"
import { isModuleAnalysis, ModuleAnalysisInterface } from "./module/ModuleAnalysisInterface.js"
import type { ModuleIndex } from "./module/ModuleIndex.js"
import { ModuleInterface } from "./module/ModuleInterface.js"
import { isModuleListener, ModuleListenerInterface } from "./module/ModuleListenerInterface.js"
import { isModuleServer, ModuleServerInterface } from "./module/ModuleServerInterface.js"
import type { GreenITResult } from "./module/analysis/output/greenit/GreenITResult.js"
import type { LighthouseResult } from "./module/analysis/output/lighthouse/LighthouseResult.js"
import type { ObservatoryResult } from "./module/analysis/output/observatory/ObservatoryResult.js"
import type { Result } from "./module/analysis/output/Result.js"
import { SsllabsServerGrade } from "./module/analysis/output/ssllabs-server/enum/SsllabsServerGrade.js"
import { SsllabsServerStatus } from "./module/analysis/output/ssllabs-server/enum/SsllabsServerStatus.js"
import type { SsllabsServerEndpoint } from "./module/analysis/output/ssllabs-server/model/SsllabsServerEndpoint.js"
import type { SsllabsServerResult } from "./module/analysis/output/ssllabs-server/model/SsllabsServerResult.js"
import { GenericReport } from "./report/Report.js"
import { timeout } from "./time/timeout.js"
import { validateInput } from "./validation/InputValidation.js"
import { GreenITReport } from "./report/analysis/GreenITReport.js"
import { LighthouseReport } from "./report/analysis/LighthouseReport.js"
import { ObservatoryReport } from "./report/analysis/ObservatoryReport.js"
import { SsllabsServerReport } from "./report/analysis/SsllabsServerReport.js"

const Helper = {
  timeout,
}

export {
  ConfigError,
  Helper,
  isModuleAnalysis,
  isModuleListener,
  isModuleServer,
  Module,
  ModuleAnalysisInterface,
  ModuleInterface,
  ModuleListenerInterface,
  ModuleServerInterface,

  // Reports
  GenericReport,
  GreenITReport,
  LighthouseReport,
  ObservatoryReport,
  SsllabsServerReport,
  Request,
  ThresholdError,
  validateInput,
  SsllabsServerStatus,
  SsllabsServerGrade,
}

export type {
  Config,
  ModuleIndex,
  Result,

  // Analysis module config
  GreenITConfig,
  LighthouseConfig,
  ObservatoryConfig,
  SsllabsServerConfig,

  // Analysis module results
  GreenITResult,
  LighthouseResult,
  ObservatoryResult,
  SsllabsServerResult,
  SsllabsServerEndpoint,
}
