import { CheckIn, Prisma } from '@prisma/client'
import { randomUUID } from 'node:crypto'

import dayjs from 'dayjs'
import { CheckInsRepository } from '../check-ins.repository'

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public items: CheckIn[] = []

  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf('date')
    const endOfTheDay = dayjs(date).endOf('date')

    const checkInOnSameDate = this.items.find((checkIn) => {
      const checkInDate = dayjs(checkIn.createdAt)
      const isOnSameDate =
        checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay)

      const isFromSameUser = checkIn.userId === userId

      return isOnSameDate && isFromSameUser
    })
    if (!checkInOnSameDate) {
      return null
    }
    return checkInOnSameDate
  }

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn: CheckIn = {
      id: randomUUID(),
      gymId: data.gymId,
      userId: data.userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      validatedAt: data.validatedAt ? new Date(data.validatedAt) : null,
    }

    this.items.push(checkIn)

    return checkIn
  }
}
