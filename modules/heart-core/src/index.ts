import { ConfigError } from "./error/ConfigError"
import { ThresholdError } from "./error/ThresholdError"
import { Request } from "./http/Request"
import type { Config } from "./module/analysis/input/Config"
import type { GreenITConfig } from "./module/analysis/input/greenit/GreeenITConfig"
import type { LighthouseConfig } from "./module/analysis/input/lighthouse/LighthouseConfig"
import type { ObservatoryConfig } from "./module/analysis/input/observatory/ObservatoryConfig"
import type { SsllabsServerConfig } from "./module/analysis/input/ssllabs-server/SsllabsServerConfig"
import { Module } from "./module/Module"
import { isModuleAnalysis, ModuleAnalysisInterface } from "./module/ModuleAnalysisInterface"
import type { ModuleIndex } from "./module/ModuleIndex"
import { ModuleInterface } from "./module/ModuleInterface"
import { isModuleListener, ModuleListenerInterface } from "./module/ModuleListenerInterface"
import { isModuleServer, ModuleServerInterface } from "./module/ModuleServerInterface"
import type { GreenITResult } from "./module/analysis/output/greenit/GreenITResult"
import type { LighthouseResult } from "./module/analysis/output/lighthouse/LighthouseResult"
import type { ObservatoryResult } from "./module/analysis/output/observatory/ObservatoryResult"
import type { Result } from "./module/analysis/output/Result"
import { SsllabsServerGrade } from "./module/analysis/output/ssllabs-server/enum/SsllabsServerGrade"
import { SsllabsServerStatus } from "./module/analysis/output/ssllabs-server/enum/SsllabsServerStatus"
import type { SsllabsServerEndpoint } from "./module/analysis/output/ssllabs-server/model/SsllabsServerEndpoint"
import type { SsllabsServerResult } from "./module/analysis/output/ssllabs-server/model/SsllabsServerResult"
import { Report } from "./report/Report"
import { timeout } from "./time/timeout"
import { validateInput } from "./validation/InputValidation"

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
  Report,
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
