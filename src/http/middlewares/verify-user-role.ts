import { Role } from '@/utils/enums/roles.enum'
import { FastifyReply, FastifyRequest } from 'fastify'

export function verifyUserRole(roleToVerify: Role) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const { role } = request.user
    if (role !== roleToVerify) {
      reply.status(401).send({ message: 'Unauthorized' })
    }
  }
}
