import { InMemoryCheckInsRepository } from '@/repositories/in-memory/check-ins.repository'
import { beforeEach, describe, expect, it } from 'vitest'

import { FetchUserCheckInsHistoryUseCase } from './fetch-user-check-ins-history.use-case'

let checkInsRepository: InMemoryCheckInsRepository

// sut = system under test
let sut: FetchUserCheckInsHistoryUseCase

describe('fetch user check-ins history use case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()

    sut = new FetchUserCheckInsHistoryUseCase(checkInsRepository)
  })

  it('should be able to fetch user check-ins history', async () => {
    await checkInsRepository.create({
      gymId: 'gym-id-1',
      userId: 'user-id-1',
    })
    await checkInsRepository.create({
      gymId: 'gym-id-2',
      userId: 'user-id-1',
    })

    const { checkIns } = await sut.execute({
      userId: 'user-id-1',
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gymId: 'gym-id-1' }),
      expect.objectContaining({ gymId: 'gym-id-2' }),
    ])
  })

  it('should be able to fetch paginated check-ins history', async () => {
    for (let i = 1; i <= 22; i++) {
      await checkInsRepository.create({
        gymId: `gym-id-${i}`,
        userId: 'user-id-1',
      })
    }

    const { checkIns } = await sut.execute({
      userId: 'user-id-1',
      page: 2,
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gymId: 'gym-id-21' }),
      expect.objectContaining({ gymId: 'gym-id-22' }),
    ])
  })
})
