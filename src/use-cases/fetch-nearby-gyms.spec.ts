import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryGymsRepository } from '@/repositories/in-memory/gyms.repository'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'

let gymsRepository: InMemoryGymsRepository

// sut = system under test
let sut: FetchNearbyGymsUseCase

const defaultCoordinate = {
  latitude: -30.0618911,
  longitude: -51.1480857,
}

const distantCoordinate = {
  latitude: -29.6952969,
  longitude: -51.1299876,
}

describe('fetch nearby gyms use case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()

    sut = new FetchNearbyGymsUseCase(gymsRepository)
  })

  it('should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      id: 'gym-id-1',
      title: 'Near Gym',
      phone: '+5511999999999',
      description: 'Near Gym description',
      latitude: defaultCoordinate.latitude,
      longitude: defaultCoordinate.longitude,
    })

    await gymsRepository.create({
      id: 'gym-id-2',
      title: 'Distant Gym',
      phone: '+5511999999999',
      description: 'Distant Gym description',
      latitude: distantCoordinate.latitude,
      longitude: distantCoordinate.longitude,
    })

    const { gyms } = await sut.execute({
      userLatitude: defaultCoordinate.latitude,
      userLongitude: defaultCoordinate.longitude,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })])
  })
})
