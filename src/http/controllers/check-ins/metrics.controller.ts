import { makeGetUserMetricsUseCase } from '@/use-cases/factories/make-get-user-metrics-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function metrics(request: FastifyRequest, reply: FastifyReply) {
  const { sub: userId } = request.user

  const useCase = makeGetUserMetricsUseCase()

  const { checkInsCount } = await useCase.execute({
    userId,
  })

  return reply.status(200).send({ checkInsCount })
}
