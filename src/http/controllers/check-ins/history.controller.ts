import { makeFetchUserCheckInsHistoryUseCase } from '@/use-cases/factories/make-fetch-user-check-ins-history-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function history(request: FastifyRequest, reply: FastifyReply) {
  const checkInsHistoryQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  })

  const { sub: userId } = request.user

  const { page } = checkInsHistoryQuerySchema.parse(request.query)

  const useCase = makeFetchUserCheckInsHistoryUseCase()

  const { checkIns } = await useCase.execute({
    page,
    userId,
  })

  return reply.status(200).send({ checkIns })
}
