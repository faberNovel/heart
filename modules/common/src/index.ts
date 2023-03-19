import { ConfigError } from "./error/ConfigError.js"
import { ListenersError } from "./error/ListenersError.js"
import { ThresholdError } from "./error/ThresholdError.js"
import { Request } from "./http/Request.js"
import type { Config } from "./module/config/Config.js"
import { GreenITConfig } from "./module/config/greenit/GreeenITConfig.js"
import type { LighthouseConfig } from "./module/config/lighthouse/LighthouseConfig.js"
import { ObservatoryConfig } from "./module/config/observatory/ObservatoryConfig.js"
import { SsllabsServerConfig } from "./module/config/ssllabs-server/SsllabsServerConfig.js"
import { Module } from "./module/Module.js"
import { isModuleAnalysis, ModuleAnalysisInterface } from "./module/ModuleAnalysisInterface.js"
import type { ModuleIndex } from "./module/ModuleIndex.js"
import { ModuleInterface } from "./module/ModuleInterface.js"
import { isModuleListener, ModuleListenerInterface } from "./module/ModuleListenerInterface.js"
import { isModuleServer, ModuleServerInterface } from "./module/ModuleServerInterface.js"
import { GreenITReport } from "./report/greenit/GreenITReport.js"
import { LighthouseReport } from "./report/lighthouse/LighthouseReport.js"
import { ObservatoryReport } from "./report/observatory/ObservatoryReport.js"
import { GenericReport } from "./report/Report.js"
import type { Result } from "./report/Result.js"
import { SsllabsServerStatus } from "./report/ssllabs-server/enum/SsllabsServerStatus.js"
import { SsllabsServerReport } from "./report/ssllabs-server/SsllabsServerReport.js"
import { timeout } from "./time/timeout.js"
import { validateInput } from "./validation/InputValidation.js"

const Helper = {
  timeout,
}

export {
  ConfigError,
  ListenersError,
  ThresholdError,

  // Modules
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
  validateInput,
  SsllabsServerStatus,
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
}
