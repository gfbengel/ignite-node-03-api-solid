import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'
import { Gym, Prisma } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { FindManyNearbyParams, GymsRepository } from '../gyms.repository'

export class InMemoryGymsRepository implements GymsRepository {
  public items: Gym[] = []

  async findById(id: string) {
    const gym = this.items.find((item) => item.id === id)
    if (!gym) {
      return null
    }
    return gym
  }

  async findManyNearby(params: FindManyNearbyParams): Promise<Gym[]> {
    return this.items
      .filter((item) => {
        const distance = getDistanceBetweenCoordinates(params.coordinate, {
          latitude: item.latitude.toNumber(),
          longitude: item.longitude.toNumber(),
        })
        const MAX_DISTANCE_IN_KILOMETERS = 10

        return distance <= MAX_DISTANCE_IN_KILOMETERS
      })
      .slice((params.page - 1) * 20, params.page * 20)
  }

  async searchMany(query: string, page: number) {
    return this.items
      .filter((item) => item.title.includes(query))
      .slice((page - 1) * 20, page * 20)
  }

  async create(data: Prisma.GymCreateInput) {
    const gym: Gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    }

    this.items.push(gym)

    return gym
  }
}
