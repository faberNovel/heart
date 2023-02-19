import { Module, ModuleInterface } from "@fabernovel/heart-core"

export class ModuleTplModule extends Module {
  constructor(module: Omit<ModuleInterface, "id">) {
    super(module)
  }
}
