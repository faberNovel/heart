import {
  InputError,
  validateAnalysisInput,
  type Config,
  type ModuleMetadata,
  type ParsedAnalysisInput,
  type ModuleListenerDatabaseInterface,
  isModuleListenerDatabase,
  type GenericReport,
  type ModuleAnalysisInterface,
  type ModuleListenerInterface,
  type Result,
} from "@fabernovel/heart-common"
import { Command, InvalidArgumentError } from "commander"
import type { PackageJsonModule } from "../../module/PackageJson.js"
import { createVerboseOption, type CommonOptions } from "../CommonOption.js"
import {
  createConfigOption,
  createExceptListenersOption,
  createOnlyListenersOption,
  createThresholdOption,
  type AnalysisOptions,
} from "./AnalysisOption.js"
import { checkEnvironmentVariables, initializeModules } from "../../module/ModuleLoader.js"
import { migrateListenerDatabase } from "../../module/ModuleMigration.js"
import { startAnalysis, notifyListenerModules } from "../../module/ModuleOrchestrator.js"

type AnalysisSubcommandCallback = <C extends Config>(
  verbose: boolean,
  config: C,
  threshold: number | undefined,
  listenerModulesMetadataMapFiltered: Map<string, PackageJsonModule>
) => Promise<void>

function prepareOptionsForValidation(options: AnalysisOptions): ParsedAnalysisInput {
  return {
    config: options.config,
    threshold: options.threshold,
    except_listeners: options.exceptListeners,
    only_listeners: options.onlyListeners,
    verbose: options.verbose,
  }
}

/**
 * Create a command dedicated to the given analysis module
 */
export const createAnalysisSubcommand = <C extends Config>(
  moduleMetadata: ModuleMetadata,
  listenerModulesMetadataMap: Map<string, PackageJsonModule>,
  callback: AnalysisSubcommandCallback
): Command => {
  const subcommand = new Command(moduleMetadata.id)

  subcommand
    .description(`Analyzes a URL with ${moduleMetadata.service.name}`)
    .addOption(createVerboseOption())
    .addOption(createConfigOption())
    .addOption(createThresholdOption())
    .addOption(createExceptListenersOption())
    .addOption(createOnlyListenersOption())
    .action(async (options: CommonOptions & AnalysisOptions) => {
      try {
        const listenerModulesIds = new Array<string>()
        listenerModulesMetadataMap.forEach((metadata) => {
          listenerModulesIds.push(metadata.heart.id)
        })
        const unvalidatedInputs = prepareOptionsForValidation(options)
        const { config, threshold, except_listeners, only_listeners } = validateAnalysisInput(
          unvalidatedInputs,
          listenerModulesIds
        )

        if (except_listeners !== undefined) {
          listenerModulesMetadataMap.forEach((metadata, modulePath, m) => {
            if (except_listeners.includes(metadata.heart.id)) {
              m.delete(modulePath)
            }
          })
        } else if (only_listeners !== undefined) {
          listenerModulesMetadataMap.forEach((metadata, modulePath, m) => {
            if (!only_listeners.includes(metadata.heart.id)) {
              m.delete(modulePath)
            }
          })
        }

        await callback(options.verbose, config as C, threshold, listenerModulesMetadataMap)
      } catch (error) {
        if (error instanceof InputError) {
          const e = new InvalidArgumentError(error.cause[0].message ?? error.message)
          return Promise.reject(e)
        } else {
          return Promise.reject(error)
        }
      }
    })

  return subcommand
}

/**
 * Callback function called once the CLI command has been executed (the user hit "enter").
 * @param config
 * @param threshold
 * @param listenerModulesMetadataMap Filtered map of listener modules metadata and their file path
 */
export function createAnalysisSubcommandCallback(
  packageJsonModule: PackageJsonModule,
  modulePath: string
): AnalysisSubcommandCallback {
  return async <C extends Config>(
    verbose: boolean,
    config: C,
    threshold: number | undefined,
    listenerModulesMetadataMap: Map<string, PackageJsonModule>
  ) => {
    // TODO:
    // 1- load default env
    // 2- validate
    // load and validate environment variables for the analysis and listeners modules
    checkEnvironmentVariables([modulePath, ...listenerModulesMetadataMap.keys()])

    // initialize the modules
    const analysisModules = await initializeModules<ModuleAnalysisInterface<Config, GenericReport<Result>>>(
      new Map([[modulePath, packageJsonModule]]),
      verbose
    )
    const listenerModules = await initializeModules<ModuleListenerInterface>(
      listenerModulesMetadataMap,
      verbose
    )

    // run database migrations for listener database modules
    const listenerDatabaseModules = listenerModules.filter(
      (listenerModule): listenerModule is ModuleListenerDatabaseInterface =>
        isModuleListenerDatabase(listenerModule)
    )
    if (listenerDatabaseModules.length > 0) {
      await migrateListenerDatabase(listenerDatabaseModules)
    }

    const report = await startAnalysis(analysisModules[0], config, threshold)

    // notify the listener modules
    await notifyListenerModules(listenerModules, report)
  }
}
