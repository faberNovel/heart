import { ReportEntity } from "./entities/ReportEntity.js"
import { ServiceEntity } from "./entities/ServiceEntity.js"
import { InputError } from "./error/InputError.js"
import { get, post } from "./http/Request.js"
import type { ParsedAnalysisInput, ValidatedAnalysisInput } from "./input/AnalysisInput.js"
import type { ParsedServerInput } from "./input/ServerInput.js"
import type { Config } from "./module/config/Config.js"
import type { GreenITConfig } from "./module/config/greenit/GreeenITConfig.js"
import type { LighthouseConfig } from "./module/config/lighthouse/LighthouseConfig.js"
import type { ObservatoryConfig } from "./module/config/observatory/ObservatoryConfig.js"
import type { SsllabsServerConfig } from "./module/config/ssllabs-server/SsllabsServerConfig.js"
import { Module } from "./module/Module.js"
import { isModuleAnalysis, type ModuleAnalysisInterface } from "./module/analysis/ModuleAnalysisInterface.js"
import type { ModuleIndex } from "./module/ModuleIndex.js"
import type { ModuleInterface } from "./module/ModuleInterface.js"
import { isModuleListener, type ModuleListenerInterface } from "./module/listener/ModuleListenerInterface.js"
import {
  isModuleListenerDatabase,
  type ModuleListenerDatabaseInterface,
} from "./module/listener/ModuleListenerDatabaseInterface.js"
import { isModuleServer, type ModuleServerInterface } from "./module/server/ModuleServerInterface.js"
import { GreenITReport } from "./report/greenit/GreenITReport.js"
import { LighthouseReport } from "./report/lighthouse/LighthouseReport.js"
import { ObservatoryScanState } from "./report/observatory/enum/ObservatoryScanState.js"
import { ObservatoryReport } from "./report/observatory/ObservatoryReport.js"
import type { GenericReport } from "./report/Report.js"
import type { Result } from "./report/Result.js"
import { SsllabsServerStatus } from "./report/ssllabs-server/enum/SsllabsServerStatus.js"
import { SsllabsServerReport } from "./report/ssllabs-server/SsllabsServerReport.js"
import { timeout } from "./time/timeout.js"
import {
  getAnalysisValidationSchema,
  validateAnalysisInput,
} from "./validation/input/analysis/AnalysisInputValidation.js"
import { validateServerInput } from "./validation/input/server/ServerInputValidation.js"

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
  ModuleListenerDatabaseInterface,
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

  // Input
  ParsedAnalysisInput,
  ParsedServerInput,
  ValidatedAnalysisInput,
}
export {
  // Database
  ReportEntity,
  ServiceEntity,

  // Errors
  InputError,

  // Modules
  Helper,
  isModuleAnalysis,
  isModuleListener,
  isModuleListenerDatabase,
  isModuleServer,
  Module,

  // Reports
  GreenITReport,
  LighthouseReport,
  ObservatoryReport,
  ObservatoryScanState,
  SsllabsServerReport,
  Request,
  SsllabsServerStatus,

  // Validation
  getAnalysisValidationSchema,
  validateAnalysisInput,
  validateServerInput,
}
