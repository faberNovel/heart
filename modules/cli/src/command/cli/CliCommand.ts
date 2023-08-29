import { Command } from "commander"
import { readFileSync } from "node:fs"
import { argv } from "node:process"
import type { PackageJson } from "type-fest"
import { loadModulesMetadata } from "../../module/ModuleLoader.js"
import { createAnalysisSubcommand, createAnalysisSubcommandCallback } from "../analysis/AnalysisCommand.js"
import { createServerSubcommand, createServerSubcommandCallback } from "../server/ServerCommand.js"

/**
 * Create the Commander Command object.
 * Set the command version to match the one defined in the package.json file.
 * Add a --debug option.
 */
function createCommand(): Command {
  const cmd = new Command()

  const packageJsonUrl = new URL(`../../../package.json`, import.meta.url)
  const packageJson = JSON.parse(readFileSync(packageJsonUrl, "utf8")) as PackageJson

  cmd.version(packageJson.version ?? "")

  return cmd
}

/**
 * 1. Load every modules referenced in package.json.
 * 2. Create the CLI command: one CLI argument per analysis and server module.
 */
export async function start(cwd: string): Promise<Command> {
  const cmd = createCommand()
  const [analysisModulesMetadataMap, listenerModulesMetadataMap, serverModulesMetadataMap] =
    await loadModulesMetadata(cwd)

  // create and add 1 command for each analysis module
  analysisModulesMetadataMap.forEach((packageJsonModule, modulePath) => {
    const callback = createAnalysisSubcommandCallback(packageJsonModule, modulePath)

    const analysisCommand = createAnalysisSubcommand(
      packageJsonModule.heart,
      listenerModulesMetadataMap,
      callback
    )

    cmd.addCommand(analysisCommand)
  })

  // create and add 1 command for each server module
  serverModulesMetadataMap.forEach((packageJsonModule, modulePath: string) => {
    const callback = createServerSubcommandCallback(
      packageJsonModule,
      modulePath,
      analysisModulesMetadataMap,
      listenerModulesMetadataMap
    )

    const serverCommand = createServerSubcommand(packageJsonModule.heart, callback)

    cmd.addCommand(serverCommand)
  })

  return cmd
    .on("command:*", () => {
      cmd.error("Invalid command name.")
    })
    .parseAsync(argv)
}
