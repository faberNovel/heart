import { env } from "node:process"
import { Client } from "ssh2"
import databaseConfig from "../config/mikro-orm.config.js"

export class SshClient {
  #client = new Client()
  #databaseUrl = new URL(databaseConfig.clientUrl ?? "")
  #serverUrl = new URL(env.HEART_MYSQL_DATABASE_URL ? `ssh://${env.HEART_MYSQL_DATABASE_URL}` : "")

  constructor() {
    this.#client
      .on("ready", () => {
        console.log("Client :: ready")
        this.#client.forwardIn(this.#databaseUrl.host, Number(this.#databaseUrl.port), (err) => {
          if (err) throw err
          console.log("Listening for this.#clientections on server on port 8000!")
        })
      })
      .on("tcp connection", (info, accept) => {
        console.log("TCP :: INCOMING CONNECTION:")
        console.dir(info)
        accept()
          .on("close", () => {
            console.log("TCP :: CLOSED")
          })
          .on("data", (data) => {
            console.log("TCP :: DATA: " + data)
          })
          .end(
            [
              "HTTP/1.1 404 Not Found",
              "Date: Thu, 15 Nov 2012 02:07:58 GMT",
              "Server: ForwardedConnection",
              "Content-Length: 0",
              "Connection: close",
              "",
              "",
            ].join("\r\n")
          )
      })
      .connect({
        host: this.#serverUrl.host,
        port: Number(this.#serverUrl.port),
        username: this.#serverUrl.username,
        password: this.#serverUrl.password,
      })
  }
}
