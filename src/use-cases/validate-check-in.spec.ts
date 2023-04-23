import { InMemoryCheckInsRepository } from '@/repositories/in-memory/check-ins.repository'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { Times } from '@/utils/enums/times.enum'
import { CheckInAlreadyValidatedError } from './errors/check-in-already-validated.error'
import { ResourceNotFoundError } from './errors/resource-not-found.error'
import { ValidateCheckInUseCase } from './validate-check-in.use-case'

let checkInsRepository: InMemoryCheckInsRepository

// sut = system under test
let sut: ValidateCheckInUseCase

const defaultCoordinate = {
  latitude: -30.0618911,
  longitude: -51.1480857,
}

describe('validate check-in use case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()

    sut = new ValidateCheckInUseCase(checkInsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to validate the check-in', async () => {
    const checkInData = {
      gymId: 'gym-id-1',
      userId: 'user-id-1',
      userLongitude: defaultCoordinate.longitude,
      userLatitude: defaultCoordinate.latitude,
    }

    const createdCheckIn = await checkInsRepository.create(checkInData)

    const { checkIn } = await sut.execute({ checkInId: createdCheckIn.id })

    expect(checkIn.validatedAt).toEqual(expect.any(Date))
    expect(checkInsRepository.items[0].validatedAt).toEqual(expect.any(Date))
  })

  it('should not be able to validate an inexistent check-in', async () => {
    await expect(() =>
      sut.execute({ checkInId: 'inexistent-check-in-id' }),
    ).rejects.toThrow(ResourceNotFoundError)
  })

  it('should not be able to validate the check-in twice', async () => {
    const checkInData = {
      gymId: 'gym-id-1',
      userId: 'user-id-1',
      userLongitude: defaultCoordinate.longitude,
      userLatitude: defaultCoordinate.latitude,
    }

    const createdCheckIn = await checkInsRepository.create(checkInData)
    await sut.execute({ checkInId: createdCheckIn.id })

    await expect(() =>
      sut.execute({ checkInId: createdCheckIn.id }),
    ).rejects.toThrow(CheckInAlreadyValidatedError)
  })

  it('should not be able to validate the check-in after 20 minutes of its creation', async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 13, 40))

    const checkInData = {
      gymId: 'gym-id-1',
      userId: 'user-id-1',
      userLongitude: defaultCoordinate.longitude,
      userLatitude: defaultCoordinate.latitude,
    }

    const createdCheckIn = await checkInsRepository.create(checkInData)

    vi.advanceTimersByTime(Times.ONE_MINUTE_IN_MS * 21)

    await expect(() =>
      sut.execute({ checkInId: createdCheckIn.id }),
    ).rejects.toThrow(Error)
  })
})
