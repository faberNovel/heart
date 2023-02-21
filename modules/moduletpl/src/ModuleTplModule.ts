import { Module, ModuleInterface } from "@fabernovel/heart-common"

export class ModuleTplModule extends Module {
  constructor(module: Pick<ModuleInterface, "name" | "service">) {
    super(module)
  }
}
