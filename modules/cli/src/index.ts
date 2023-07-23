import dotenv from "dotenv"
import { cwd, exit } from "node:process"
import { start } from "./command/cli/CliCommand.js"
import { logger } from "@fabernovel/heart-common"

/**
 * Loads `.env` file contents into process.env.
 * Assume that the root path is the one from where the script has been called.
 * /!\ this approach does not follow symlink.
 */
dotenv.config({ path: `${cwd()}/.env` })

void (async () => {
  try {
    await start()
  } catch (error) {
    logger.error(error)

    exit(1)
  }
})()
