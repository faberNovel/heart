import { Module, logger, type ModuleMetadata } from "@fabernovel/heart-common"

export class TplModule extends Module {
  constructor(moduleMetadata: ModuleMetadata, verbose: boolean) {
    super(moduleMetadata, verbose)

    if (verbose) {
      logger.info(`${moduleMetadata.name} initialized.`)
    }
  }
}
