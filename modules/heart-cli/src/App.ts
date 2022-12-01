import {
  Config,
  ModuleAnalysisInterface,
  ModuleInterface,
  ModuleListenerInterface,
  ModuleServerInterface,
  Report,
} from "@fabernovel/heart-core"
import { CorsOptions } from "cors"
import * as ora from "ora"

export class App {
  private spinner = ora({ spinner: "hearts", interval: 200 })

  constructor(private listenerModules: ModuleListenerInterface[]) {}

  public async notifyListenerModules(report: Report): Promise<void[]> {
    return Promise.all(
      this.listenerModules.map((listenerModule) => listenerModule.notifyAnalysisDone(report))
    )
  }

  public async startAnalysis<T extends Config>(
    module: ModuleAnalysisInterface<T>,
    conf: T,
    threshold?: number
  ): Promise<Report> {
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

      return report
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
}
