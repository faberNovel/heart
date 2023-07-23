import winston from "winston"

export const logger = winston.createLogger({
  level: "info",
  transports: [
    //
    // - Write all logs with importance level of `error` or less to `console.log`
    //
    new winston.transports.Console(),
  ],
})
