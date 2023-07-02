import { type ModuleListenerDatabaseInterface } from "@fabernovel/heart-common"
import ora from "ora"

/**
 * Migrate the database of every database listener module to their latest version.
 * Migrate only the databases that require migrations.
 */
export async function migrateListenerDatabase(
  listenerDatabaseModules: ModuleListenerDatabaseInterface[]
): Promise<void> {
  const hasPendingMigrations = await Promise.all(listenerDatabaseModules.map((m) => m.hasPendingMigrations()))

  if (hasPendingMigrations.some((hasPendingMigration) => hasPendingMigration)) {
    const spinner = ora({ spinner: "dots", interval: 200 })

    spinner.start(`Update the databases...`)

    try {
      await Promise.all(listenerDatabaseModules.map((m) => m.runPendingMigrations()))

      spinner.succeed("Databases update completed.")

      return Promise.resolve()
    } catch (error) {
      let reason = ""

      if (typeof error === "string") {
        reason = error
      } else if (error instanceof Error) {
        reason = error.message
      }

      if (reason.length > 0) {
        reason = ` Reason: ${reason}.`
      }

      spinner.fail(`Databases update failed.${reason}`)

      return Promise.reject(error)
    }
  }
}
