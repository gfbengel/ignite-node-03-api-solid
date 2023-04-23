import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryGymsRepository } from '@/repositories/in-memory/gyms.repository'
import { SearchGymsUseCase } from './search-gyms.use-case'

let gymsRepository: InMemoryGymsRepository

// sut = system under test
let sut: SearchGymsUseCase

describe('search gyms use case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()

    sut = new SearchGymsUseCase(gymsRepository)
  })

  it('should be able to search for gyms', async () => {
    await gymsRepository.create({
      id: 'gym-id-1',
      title: 'JavaScript Gym',
      phone: '+5511999999999',
      description: 'JavaScript Gym description',
      latitude: -30.0028912,
      longitude: -51.1169292,
    })

    await gymsRepository.create({
      id: 'gym-id-2',
      title: 'TypeScript Gym',
      phone: '+5511999999999',
      description: 'TypeScript Gym description',
      latitude: -30.0028912,
      longitude: -51.1169292,
    })

    const { gyms } = await sut.execute({
      query: 'JavaScript',
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'JavaScript Gym' })])
  })

  it('should be able to fetch paginated gyms search', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        id: `gym-id-${i}`,
        title: `JS Gym ${i}`,
        phone: '+5511999999999',
        description: `JS Gym description ${i}`,
        latitude: -30.0028912,
        longitude: -51.1169292,
      })
    }

    const { gyms } = await sut.execute({
      query: 'JS Gym',
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'JS Gym 21' }),
      expect.objectContaining({ title: 'JS Gym 22' }),
    ])
  })
})
