import { ConfigError } from "./error/ConfigError"
import { ThresholdError } from "./error/ThresholdError"
import { Request } from "./http/Request"
import type { Config } from "./module/input/Config"
import type { GreenITConfig } from "./module/input/greenit/GreeenITConfig"
import type { LighthouseConfig } from "./module/input/lighthouse/LighthouseConfig"
import type { ObservatoryConfig } from "./module/input/observatory/ObservatoryConfig"
import type { SsllabsServerConfig } from "./module/input/ssllabs-server/SsllabsServerConfig"
import { Module } from "./module/Module"
import { isModuleAnalysis, ModuleAnalysisInterface } from "./module/ModuleAnalysisInterface"
import type { ModuleIndex } from "./module/ModuleIndex"
import { ModuleInterface } from "./module/ModuleInterface"
import { isModuleListener, ModuleListenerInterface } from "./module/ModuleListenerInterface"
import { isModuleServer, ModuleServerInterface } from "./module/ModuleServerInterface"
import type { GreenITResult } from "./module/output/greenit/GreenITResult"
import type { LighthouseResult } from "./module/output/lighthouse/LighthouseResult"
import type { ObservatoryResult } from "./module/output/observatory/ObservatoryResult"
import type { RawResult } from "./module/output/RawResult"
import { SsllabsServerGrade } from "./module/output/ssllabs-server/enum/SsllabsServerGrade"
import { SsllabsServerStatus } from "./module/output/ssllabs-server/enum/SsllabsServerStatus"
import type { SsllabsServerEndpoint } from "./module/output/ssllabs-server/model/SsllabsServerEndpoint"
import type { SsllabsServerResult } from "./module/output/ssllabs-server/model/SsllabsServerResult"
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
  RawResult,

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
