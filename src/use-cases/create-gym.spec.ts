import { InMemoryGymsRepository } from '@/repositories/in-memory/gyms.repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { CreateGymUseCase } from './create-gym.use-case'

let gymsRepository: InMemoryGymsRepository
// sut = system under test
let sut: CreateGymUseCase

describe('create gym use case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()

    sut = new CreateGymUseCase(gymsRepository)
  })

  it('should be able to create gym', async () => {
    const { gym } = await sut.execute({
      title: "John Does's Gym",
      phone: '+5511999999999',
      description: 'Gym description',
      latitude: -30.0618911,
      longitude: -51.1480857,
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
