declare module "greenit-cli" {
  type SizeNames = "desktop" | "galaxyS9" | "galaxyS20" | "iPhone8" | "iPhone8Plus" | "iPhoneX" | "iPad"

  export type sizes = {
    [key in SizeNames]: {
      width: number
      height: number
      isMobile: boolean
    }
  }
}
