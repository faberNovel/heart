import {
  isModuleListenerDatabase,
  type Config,
  type GenericReport,
  type ModuleAnalysisInterface,
  type ModuleListenerDatabaseInterface,
  type ModuleListenerInterface,
  type Result,
  type ModuleServerInterface,
} from "@fabernovel/heart-common"
import type { FastifyCorsOptions } from "@fastify/cors"
import { Command } from "commander"
import { readFileSync } from "node:fs"
import { argv } from "node:process"
import type { PackageJson } from "type-fest"
import {
  initializeModules,
  loadEnvironmentVariables,
  loadModulesMetadata,
} from "../../module/ModuleLoader.js"
import { migrateListenerDatabase } from "../../module/ModuleMigration.js"
import { notifyListenerModules, startAnalysis, startServer } from "../../module/ModuleOrchestrator.js"
import type { PackageJsonModule } from "../../module/PackageJson.js"
import { createAnalysisSubcommand } from "../analysis/AnalysisCommand.js"
import { createServerSubcommand } from "../server/ServerCommand.js"

/**
 * Create the Commander Command object.
 * Set the command version to match the one defined in the package.json file.
 * Add a --debug option.
 */
function createCommand(cwd: string): Command {
  const cmd = new Command()

  const packageJsonUrl = new URL(`${cwd}/package.json`, import.meta.url)
  const packageJson = JSON.parse(readFileSync(packageJsonUrl, "utf8")) as PackageJson

  cmd.version(packageJson.version ?? "")

  cmd.option("-v,--verbose", "Displays debug informations", false)

  return cmd
}

/**
 * 1. Load every modules referenced in package.json.
 * 2. Create the CLI command: one CLI argument per analysis and server module.
 */
export async function start(cwd: string): Promise<Command> {
  const cmd = createCommand(cwd)
  const [analysisModulesMetadataMap, listenerModulesMetadataMap, serverModulesMetadataMap] =
    await loadModulesMetadata(cwd)

  // create and add 1 command for each analysis module
  analysisModulesMetadataMap.forEach((packageJsonModule, modulePath) => {
    /**
     * Callback function called once the CLI command has been executed (the user hit "enter").
     * @param config
     * @param threshold
     * @param listenerModulesMetadataMap Filtered map of listener modules metadata and their file path
     */
    const callback = async <C extends Config>(
      config: C,
      threshold: number | undefined,
      listenerModulesMetadataMap: Map<string, PackageJsonModule>
    ) => {
      // load and validate environment variables for the analysis and listeners modules
      loadEnvironmentVariables(modulePath)
      listenerModulesMetadataMap.forEach((_, listenerModulePath) => {
        loadEnvironmentVariables(listenerModulePath)
      })

      // initialize the modules
      const analysisModules = await initializeModules<ModuleAnalysisInterface<Config, GenericReport<Result>>>(
        new Map([[modulePath, packageJsonModule]])
      )
      const listenerModules = await initializeModules<ModuleListenerInterface>(listenerModulesMetadataMap)

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

    const analysisCommand = createAnalysisSubcommand(
      packageJsonModule.heart,
      listenerModulesMetadataMap,
      callback
    )

    cmd.addCommand(analysisCommand)
  })

  // create and add 1 command for each server module
  serverModulesMetadataMap.forEach((packageJsonModule, modulePath: string) => {
    const callback = async (port: number, cors: FastifyCorsOptions | undefined) => {
      // load environment variables for the server module
      loadEnvironmentVariables(modulePath)

      // load environment variables for the analysis modules:
      // do it once at startup instead at each route call
      analysisModulesMetadataMap.forEach((_module, modulePath) => {
        loadEnvironmentVariables(modulePath)
      })

      // initialize the server, analysis and listeners modules
      const analysisModules = await initializeModules<ModuleAnalysisInterface<Config, GenericReport<Result>>>(
        analysisModulesMetadataMap
      )
      const listenerModules = await initializeModules<ModuleListenerInterface>(listenerModulesMetadataMap)
      const serverModules = await initializeModules<ModuleServerInterface>(
        new Map([[modulePath, packageJsonModule]])
      )

      await startServer(serverModules[0], analysisModules, listenerModules, port, cors)
    }

    const serverCommand = createServerSubcommand(packageJsonModule.heart, callback)

    cmd.addCommand(serverCommand)
  })

  return cmd
    .on("command:*", () => {
      cmd.error("Invalid command name.")
    })
    .parseAsync(argv)
}
