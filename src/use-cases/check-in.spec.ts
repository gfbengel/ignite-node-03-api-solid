import { InMemoryCheckInsRepository } from '@/repositories/in-memory/check-ins.repository'
import { beforeEach, describe, expect, it } from 'vitest'

import { CheckInUseCase } from './check-in.use-case'

let checkInsRepository: InMemoryCheckInsRepository
// sut = system under test
let sut: CheckInUseCase

describe('check in use case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()

    sut = new CheckInUseCase(checkInsRepository)
  })

  it('should be able to check in', async () => {
    const checkInData = {
      gymId: 'gym-id-1',
      userId: 'user-id-1',
    }

    const { checkIn } = await sut.execute(checkInData)

    expect(checkIn.id).toEqual(expect.any(String))
  })
})
