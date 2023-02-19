import { Module, ModuleInterface } from "@fabernovel/heart-common"

export class ModuleTplModule extends Module {
  constructor(module: Omit<ModuleInterface, "id">) {
    super(module)
  }
}
