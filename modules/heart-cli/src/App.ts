import {
  isModuleListener,
  AnalysisEvents,
  ModuleAnalysisInterface,
  ModuleInterface,
  ModuleListenerInterface,
  ModuleServerInterface,
  Config,
} from "@fabernovel/heart-core"
import { CorsOptions } from "cors"
import { EventEmitter } from "events"
import * as ora from "ora"

export class App {
  private eventEmitter: EventEmitter
  private modules: ModuleInterface[]
  private spinner = ora({ spinner: "hearts", interval: 200 })

  constructor(modules: ModuleInterface[]) {
    this.eventEmitter = new EventEmitter()
    this.modules = modules
    this.registerEventsListeners()
  }

  public async startAnalysis<T extends Config>(
    module: ModuleAnalysisInterface<T>,
    conf: T,
    threshold?: number
  ): Promise<void> {
    this.spinner.start("Analysis in progress...")

    try {
      const report = await module.startAnalysis(conf, threshold)

      const reportName = report.service ? `[${report.service.name}] ` : ""
      const messageParts = [`${reportName}${report.analyzedUrl}: ${report.note}`]

      if (report.resultUrl) {
        messageParts.push(`View full report: ${report.resultUrl}`)
      }

      if (report.isThresholdReached() === true) {
        messageParts.push("Your threshold is reached")
      } else if (report.isThresholdReached() === false) {
        messageParts.push("Your threshold is not reached")
      }

      this.spinner.succeed("Analysis completed.")
      console.info(messageParts.join(". ") + ".")

      this.eventEmitter.emit(AnalysisEvents.DONE, report)

      return Promise.resolve()
    } catch (error) {
      this.spinner.fail("Analysis failed.")

      return Promise.reject(error)
    }
  }

  public startServer(
    module: ModuleServerInterface,
    modules: ModuleInterface[],
    port: number,
    cors?: CorsOptions
  ): void {
    module
      .startServer(modules, port, cors)
      .on("listening", () => console.log(`Server listening on port ${port}`))
      .on("error", (error: NodeJS.ErrnoException) => {
        console.error(error.message)
        process.exit(1)
      })
  }

  /**
   * Register events listeners for listening modules
   */
  private registerEventsListeners(): void {
    this.modules
      .filter((module: ModuleInterface): module is ModuleListenerInterface => isModuleListener(module))
      .forEach((module) => module.registerEvents(this.eventEmitter))
  }
}
