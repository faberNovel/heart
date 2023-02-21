import {
  Config,
  isModuleAnalysis,
  isModuleListener,
  isModuleServer,
  ModuleInterface,
  ModuleListenerInterface,
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
    const modules = Array.from(modulesMap.values())
    const listenerModules = modules.filter((module: ModuleInterface): module is ModuleListenerInterface =>
      isModuleListener(module)
    )

    const program = new Command()
    program.version("3.0.0")

    modulesMap.forEach((module: ModuleInterface, modulePath: string) => {
      if (isModuleAnalysis(module)) {
        const callback = async <C extends Config>(conf: C, threshold?: number) => {
          loadEnvironmentVariables(modulePath)

          const report = await startAnalysis(module, conf, threshold)

          // notify every listener module
          await notifyListenerModules(listenerModules, report)
        }

        const analysisCommand = createAnalysisCommand(module, callback)

        program.addCommand(analysisCommand)
      } else if (isModuleServer(module)) {
        const callback = (port: number, cors?: CorsOptions) => {
          loadEnvironmentVariables(modulePath)
          startServer(module, modules, port, cors)
        }

        const serverCommand = createServerCommand(module, callback)

        program.addCommand(serverCommand)
      } else if (isModuleListener(module)) {
        loadEnvironmentVariables(modulePath)
      }
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
