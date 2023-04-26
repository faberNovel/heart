import { InputError } from "@fabernovel/heart-common"
import type { FastifyError, FastifyReply, FastifyRequest } from "fastify"

/**
 * @see {@link https://www.fastify.io/docs/latest/Reference/Server/#seterrorhandler}
 */
export async function errorHandler(
  error: FastifyError,
  _request: FastifyRequest,
  reply: FastifyReply
): Promise<FastifyReply> {
  if (error instanceof InputError) {
    return reply.status(400).send({
      errors: error.cause.map((c) => c.message),
    })
  } else {
    return reply.status(500).send({
      errors: [error.message],
    })
  }
}
