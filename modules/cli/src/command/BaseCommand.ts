import { Command } from "commander"

export type BaseOptions = Partial<{
  exceptListeners: string
  onlyListeners: string
}>

export function createBaseSubcommand(name: string, description: string): Command {
  const cmd = new Command(name)

  cmd
    .description(description)
    .option(
      "--except-listeners [exceptListeners]",
      "A comma-separated list of listener modules that will not be triggered after the analysis is done"
    )
    .option(
      "--only-listeners [onlyListeners]",
      "A comma-separated list of listener modules that will be triggered after the analysis is done"
    )

  return cmd
}
