import { Config, ModuleListenerInterface } from "@fabernovel/heart-common"
import { Command } from "commander"
import { CorsOptions } from "cors"
import { config } from "dotenv"
import { readFileSync } from "node:fs"
import { argv, cwd, exit } from "node:process"
import { PackageJson } from "type-fest"
import { createAnalysisSubcommand } from "./command/analysis/AnalysisCommand.js"
import { createServerSubcommand } from "./command/server/ServerCommand.js"
import { load, loadEnvironmentVariables } from "./module/ModuleLoader.js"
import { notifyListenerModules, startAnalysis, startServer } from "./module/ModuleOrchestrator.js"

// set environment variables from a .env file
// assume that the root path is the one from where the script has been called
// /!\ this approach does not follow symlink
config({ path: `${cwd()}/.env` })

/**
 * Create the Commander Command object.
 * Set the command version to match the one defined in the package.json file.
 */
function createCommand(): Command {
  const cmd = new Command()

  const packageJsonUrl = new URL("../package.json", import.meta.url)
  const packageJson = JSON.parse(readFileSync(packageJsonUrl, "utf8")) as PackageJson

  cmd.version(packageJson.version ?? "")

  return cmd
}

void (async () => {
  try {
    const cmd = createCommand()
    const [analysisModulesMap, listenerModulesMap, serverModulesMap] = await load()
    const listenerModules = Array.from(listenerModulesMap.values()).map((listenerModule) => listenerModule)

    // analysis modules: create a command for each of them
    analysisModulesMap.forEach((analysisModule, modulePath) => {
      const callback = async <C extends Config>(
        conf: C,
        threshold: number | undefined,
        listenerModulesFiltered: ModuleListenerInterface[]
      ) => {
        loadEnvironmentVariables(modulePath)

        const report = await startAnalysis(analysisModule, conf, threshold)

        // notify filtered listener modules
        await notifyListenerModules(listenerModulesFiltered, report)
      }

      const analysisCommand = createAnalysisSubcommand(analysisModule, listenerModules, callback)

      cmd.addCommand(analysisCommand)
    })

    // server modules: create a command for each of them
    serverModulesMap.forEach((serverModule, modulePath: string) => {
      const callback = (port: number, cors: CorsOptions | undefined) => {
        loadEnvironmentVariables(modulePath)
        startServer(serverModule, analysisModulesMap.values(), listenerModules, port, cors)
      }

      const serverCommand = createServerSubcommand(serverModule, callback)

      cmd.addCommand(serverCommand)
    })

    // listener modules: load and validate environment variables
    listenerModulesMap.forEach((_, modulePath) => {
      loadEnvironmentVariables(modulePath)
    })

    await cmd
      .on("command:*", () => {
        cmd.error("Invalid command name.")
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
