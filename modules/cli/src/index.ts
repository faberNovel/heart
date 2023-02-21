import {
  Config,
  isModuleAnalysis,
  isModuleListener,
  isModuleServer,
  ModuleAnalysisInterface,
  ModuleListenerInterface,
  ModuleServerInterface,
  Result,
} from "@fabernovel/heart-common"
import { Command } from "commander"
import { CorsOptions } from "cors"
import { config } from "dotenv"
import { argv, cwd, exit } from "node:process"
import { notifyListenerModules, startAnalysis, startServer } from "./module/ModuleOrchestrator.js"
import { createAnalysisCommand } from "./command/AnalysisCommand.js"
import { createServerCommand } from "./command/ServerCommand.js"
import { load, loadEnvironmentVariables } from "./module/ModuleLoader.js"

// set environment variables from a .env file
// assume that the root path if the one from where the script has been called
// /!\ this approach does not follow symlink
config({ path: `${cwd()}/.env` })

void (async () => {
  try {
    const modulesMap = await load()

    const analysisModulesMap = new Map<string, ModuleAnalysisInterface<Config, Result>>()
    const listenerModulesMap = new Map<string, ModuleListenerInterface>()
    const serverModulesMap = new Map<string, ModuleServerInterface>()

    for (const [modulePath, module] of modulesMap) {
      if (isModuleAnalysis(module)) {
        analysisModulesMap.set(modulePath, module)
      } else if (isModuleListener(module)) {
        listenerModulesMap.set(modulePath, module)
      } else if (isModuleServer(module)) {
        serverModulesMap.set(modulePath, module)
      }
    }

    const program = new Command()
    program.version("3.0.0")

    // analysis modules: create a command for each of them
    analysisModulesMap.forEach((analysisModule, modulePath) => {
      const callback = async <C extends Config>(conf: C, threshold?: number) => {
        loadEnvironmentVariables(modulePath)

        const report = await startAnalysis(analysisModule, conf, threshold)

        // notify every listener module
        await notifyListenerModules(listenerModulesMap.values(), report)
      }

      const analysisCommand = createAnalysisCommand(analysisModule, callback)

      program.addCommand(analysisCommand)
    })

    // server modules: create a command for each of them
    serverModulesMap.forEach((serverModule, modulePath: string) => {
      const callback = (port: number, cors?: CorsOptions) => {
        loadEnvironmentVariables(modulePath)
        startServer(serverModule, analysisModulesMap.values(), listenerModulesMap.values(), port, cors)
      }

      const serverCommand = createServerCommand(serverModule, callback)

      program.addCommand(serverCommand)
    })

    // listener modules: load and validate environment variables
    listenerModulesMap.forEach((_, modulePath) => {
      loadEnvironmentVariables(modulePath)
    })

    await program
      .on("command:*", () => {
        program.error("Invalid command name.")
      })
      .parseAsync(argv)
  } catch (error) {
    if (typeof error === "string") {
      console.error(error)
    } else if (error instanceof Error) {
      console.error(error.message)
    }

    exit(1)
  }
})()
