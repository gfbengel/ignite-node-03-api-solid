import { InMemoryCheckInsRepository } from '@/repositories/in-memory/check-ins.repository'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { InMemoryGymsRepository } from '@/repositories/in-memory/gyms.repository'
import { CheckInUseCase } from './check-in.use-case'
import { MaxDistanceError } from './errors/max-distance.error'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins.error'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
// sut = system under test
let sut: CheckInUseCase

const defaultCoordinate = {
  latitude: -30.0618911,
  longitude: -51.1480857,
}

describe('check in use case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()

    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    await gymsRepository.create({
      id: 'gym-id-1',
      title: 'Gym 1',
      phone: '+5511999999999',
      description: 'Gym 1 description',
      latitude: defaultCoordinate.latitude,
      longitude: defaultCoordinate.longitude,
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const checkInData = {
      gymId: 'gym-id-1',
      userId: 'user-id-1',
      userLongitude: defaultCoordinate.longitude,
      userLatitude: defaultCoordinate.latitude,
    }

    const { checkIn } = await sut.execute(checkInData)

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    const checkInData = {
      gymId: 'gym-id-1',
      userId: 'user-id-1',
      userLongitude: defaultCoordinate.longitude,
      userLatitude: defaultCoordinate.latitude,
    }

    await sut.execute(checkInData)

    await expect(() => sut.execute(checkInData)).rejects.toBeInstanceOf(
      MaxNumberOfCheckInsError,
    )
  })

  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    const checkInData = {
      gymId: 'gym-id-1',
      userId: 'user-id-1',
      userLongitude: defaultCoordinate.longitude,
      userLatitude: defaultCoordinate.latitude,
    }

    await sut.execute(checkInData)

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.execute(checkInData)

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on distant gym', async () => {
    await gymsRepository.create({
      id: 'gym-id-2',
      title: 'Gym 2',
      phone: '+5511999999999',
      description: 'Gym 2 description',
      latitude: -30.0028912,
      longitude: -51.1169292,
    })

    const checkInData = {
      gymId: 'gym-id-2',
      userId: 'user-id-1',
      userLatitude: defaultCoordinate.latitude,
      userLongitude: defaultCoordinate.longitude,
    }

    await expect(() => sut.execute(checkInData)).rejects.toBeInstanceOf(
      MaxDistanceError,
    )
  })
})
