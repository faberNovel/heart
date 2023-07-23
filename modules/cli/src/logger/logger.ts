import winston from "winston"

export const logger = winston.createLogger({
  level: "error",
  transports: [
    //
    // - Write all logs with importance level of `error` or less to `console.log`
    //
    new winston.transports.Console(),
  ],
})
