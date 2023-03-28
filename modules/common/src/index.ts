import { ConfigInputError } from "./error/input/ConfigInputError.js"
import { ListenersInputError } from "./error/input/ListenersInputError.js"
import { ThresholdInputError } from "./error/input/ThresholdInputError.js"
import { InputError } from "./error/InputError.js"
import { get, post } from "./http/Request.js"
import type { Config } from "./module/config/Config.js"
import type { GreenITConfig } from "./module/config/greenit/GreeenITConfig.js"
import type { LighthouseConfig } from "./module/config/lighthouse/LighthouseConfig.js"
import type { ObservatoryConfig } from "./module/config/observatory/ObservatoryConfig.js"
import type { SsllabsServerConfig } from "./module/config/ssllabs-server/SsllabsServerConfig.js"
import { Module } from "./module/Module.js"
import { isModuleAnalysis, ModuleAnalysisInterface } from "./module/ModuleAnalysisInterface.js"
import type { ModuleIndex } from "./module/ModuleIndex.js"
import type { ModuleInterface } from "./module/ModuleInterface.js"
import { isModuleListener, ModuleListenerInterface } from "./module/ModuleListenerInterface.js"
import { isModuleServer, ModuleServerInterface } from "./module/ModuleServerInterface.js"
import { GreenITReport } from "./report/greenit/GreenITReport.js"
import { LighthouseReport } from "./report/lighthouse/LighthouseReport.js"
import { ObservatoryReport } from "./report/observatory/ObservatoryReport.js"
import type { GenericReport } from "./report/Report.js"
import type { Result } from "./report/Result.js"
import { SsllabsServerStatus } from "./report/ssllabs-server/enum/SsllabsServerStatus.js"
import { SsllabsServerReport } from "./report/ssllabs-server/SsllabsServerReport.js"
import { timeout } from "./time/timeout.js"
import { validateAnalysisInput } from "./validation/input/AnalysisInputValidation.js"
import { validateServerInput } from "./validation/input/ServerInputValidation.js"

const Helper = {
  timeout,
}

const Request = {
  get: get,
  post: post,
}

export type {
  // Modules
  ModuleAnalysisInterface,
  ModuleIndex,
  ModuleInterface,
  ModuleListenerInterface,
  ModuleServerInterface,

  // Reports
  GenericReport,
  Result,

  // Analysis module config
  Config,
  GreenITConfig,
  LighthouseConfig,
  ObservatoryConfig,
  SsllabsServerConfig,
}
export {
  // Errors
  InputError,
  ConfigInputError,
  ListenersInputError,
  ThresholdInputError,

  // Modules
  Helper,
  isModuleAnalysis,
  isModuleListener,
  isModuleServer,
  Module,

  // Reports
  GreenITReport,
  LighthouseReport,
  ObservatoryReport,
  SsllabsServerReport,
  Request,
  validateAnalysisInput,
  validateServerInput,
  SsllabsServerStatus,
}
