import { InMemoryCheckInsRepository } from '@/repositories/in-memory/check-ins.repository'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { GetUserMetricsUseCase } from './get-user-metrics.use-case'

let checkInsRepository: InMemoryCheckInsRepository

// sut = system under test
let sut: GetUserMetricsUseCase

describe('get user metrics use case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()

    sut = new GetUserMetricsUseCase(checkInsRepository)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to get check-ins count from metrics', async () => {
    await checkInsRepository.create({
      gymId: 'gym-id-1',
      userId: 'user-id-1',
    })
    await checkInsRepository.create({
      gymId: 'gym-id-2',
      userId: 'user-id-1',
    })

    const { checkInsCount } = await sut.execute({
      userId: 'user-id-1',
    })

    expect(checkInsCount).toEqual(2)
  })
})
