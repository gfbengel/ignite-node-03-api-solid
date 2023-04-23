import { prisma } from '@/lib/prisma'
import { CheckIn, Prisma } from '@prisma/client'
import dayjs from 'dayjs'
import { CheckInsRepository } from '../check-ins.repository'

export class PrismaCheckInsRepository implements CheckInsRepository {
  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = await prisma.checkIn.create({ data })
    return checkIn
  }

  async save(checkIn: CheckIn) {
    const updatedCheckIn = await prisma.checkIn.update({
      where: { id: checkIn.id },
      data: checkIn,
    })
    return updatedCheckIn
  }

  async findById(id: string) {
    const checkIn = await prisma.checkIn.findUnique({ where: { id } })
    return checkIn
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf('date')
    const endOfTheDay = dayjs(date).endOf('date')

    const checkInOnSameDate = await prisma.checkIn.findFirst({
      where: {
        createdAt: {
          gte: startOfTheDay.toDate(),
          lte: endOfTheDay.toDate(),
        },
        userId,
      },
    })

    return checkInOnSameDate
  }

  async findManyByUserId(userId: string, page: number) {
    const checkIns = await prisma.checkIn.findMany({
      where: { userId },
      take: 20,
      skip: (page - 1) * 20,
    })

    return checkIns
  }

  async countByUserId(userId: string) {
    const count = await prisma.checkIn.count({ where: { userId } })

    return count
  }
}
