import { Config, isModuleAnalysis, isModuleServer, ModuleInterface } from "@fabernovel/heart-core"
import { Command } from "commander"
import { config } from "dotenv"
import { createAnalysisCommand } from "./command/AnalysisCommand"
import { createServerCommand } from "./command/ServerCommand"
import { ModuleLoader } from "./module/ModuleLoader"
import { App } from "./App"
import { CorsOptions } from "cors"

// set environment variables from a.env file
// assume that the root path if the one from where the script has been called
// /!\ this approach does not follow symlink
config({ path: `${process.cwd()}/.env` })

void (async () => {
  const moduleLoader = new ModuleLoader(false)

  try {
    const modules = await moduleLoader.load()
    const app = new App(modules)

    const program = new Command()
    program.version("3.0.0")

    // create a command for each module
    modules.forEach((module: ModuleInterface) => {
      if (isModuleAnalysis(module)) {
        const callback = <T extends Config>(conf: T, threshold?: number) =>
          app.startAnalysis(module, conf, threshold)

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
