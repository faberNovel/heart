import { Config } from "@fabernovel/heart-core"
import { readFileSync } from "fs"
import { isAbsolute } from "path"

export class AnalysisOptionsValidation {
  /**
   * Validate that the analysis options are correct
   * @returns The analysis configuration and the threshold
   */
  public static validate<T extends Config>(
    configFile?: string,
    configInline?: string,
    thresholdInline?: string
  ): [T, number?] {
    if (undefined === configFile && undefined === configInline) {
      throw new Error("You must provide a configuration.")
    } else if (undefined !== configFile && undefined !== configInline) {
      throw new Error("You must provide only one configuration.")
    }

    const parsedThreshold = thresholdInline ? Number(thresholdInline) : undefined

    if (
      parsedThreshold !== undefined &&
      (isNaN(parsedThreshold) || parsedThreshold < 0 || parsedThreshold > 100)
    ) {
      throw new Error("The threshold must be a number between 0 and 100.")
    }

    try {
      const parsedConfig: T =
        undefined !== configInline
          ? (JSON.parse(configInline) as T)
          : // TypeScript cannot infer that configFile is a string at this point, so we need an assertion
            (JSON.parse(AnalysisOptionsValidation.readFile(configFile as string)) as T)

      return [parsedConfig, parsedThreshold]
    } catch (error) {
      throw new Error("Cannot parse the configuration. Please check the JSON syntax.")
    }
  }

  private static readFile(path: string): string {
    const realPath = isAbsolute(path) ? path : `${process.env.PWD as string}/${path}`

    return readFileSync(realPath, "utf8")
  }
}
