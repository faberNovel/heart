import {
  Config,
  isModuleAnalysis,
  isModuleListener,
  isModuleServer,
  ModuleInterface,
  ModuleListenerInterface,
} from "@fabernovel/heart-core"
import { Command } from "commander"
import { CorsOptions } from "cors"
import { config } from "dotenv"
import { App } from "./App"
import { createAnalysisCommand } from "./command/AnalysisCommand"
import { createServerCommand } from "./command/ServerCommand"
import { ModuleLoader } from "./module/ModuleLoader"

// set environment variables from a.env file
// assume that the root path if the one from where the script has been called
// /!\ this approach does not follow symlink
config({ path: `${process.cwd()}/.env` })

void (async () => {
  const moduleLoader = new ModuleLoader(false)

  try {
    const modules = await moduleLoader.load()
    const listenerModules = modules.filter((module: ModuleInterface): module is ModuleListenerInterface =>
      isModuleListener(module)
    )
    const app = new App(listenerModules)

    const program = new Command()
    program.version("3.0.0")

    // create a command for each module
    modules.forEach((module: ModuleInterface) => {
      if (isModuleAnalysis(module)) {
        const callback = async <T extends Config>(conf: T, threshold?: number) => {
          const report = await app.startAnalysis(module, conf, threshold)

          // notify every listener module
          await app.notifyListenerModules(report)
        }

        const analysisCommand = createAnalysisCommand(module, callback)

        program.addCommand(analysisCommand)
      } else if (isModuleServer(module)) {
        const callback = (port: number, cors?: CorsOptions) => app.startServer(module, modules, port, cors)

        const serverCommand = createServerCommand(module, callback)

        program.addCommand(serverCommand)
      }
    })

    await program
      .on("command:*", () => {
        program.error("Invalid command name.")
      })
      .parseAsync(process.argv)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
})()
