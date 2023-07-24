import type { ModuleMetadata } from "@fabernovel/heart-common"
import type { PackageJson } from "type-fest"

export type PackageJsonModule = Omit<PackageJson, "name" | "main"> & {
  name: NonNullable<PackageJson["name"]>
  main: NonNullable<PackageJson["main"]>
  heart: ModuleMetadata
}
