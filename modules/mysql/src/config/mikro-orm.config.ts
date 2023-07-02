import { defineConfig } from "@mikro-orm/mysql"
import { createDatabaseConfig } from "@fabernovel/heart-common"
import { env } from "node:process"

export default defineConfig(
  createDatabaseConfig({
    clientUrl: env.HEART_MYSQL_URL as string,
    charset: "utf8mb4",
    collate: "utf8mb4_general_ci",
  })
)
