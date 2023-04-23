import { GymsRepository } from '@/repositories/gyms.repository'
import { Gym } from '@prisma/client'

interface FetchNearbyGymsUseCaseRequest {
  userLatitude: number
  userLongitude: number
  page?: number
}

interface FetchNearbyGymsUseCaseResponse {
  gyms: Gym[]
}

export class FetchNearbyGymsUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    userLatitude,
    userLongitude,
    page = 1,
  }: FetchNearbyGymsUseCaseRequest): Promise<FetchNearbyGymsUseCaseResponse> {
    const gyms = await this.gymsRepository.findManyNearby({
      coordinate: { latitude: userLatitude, longitude: userLongitude },
      page,
    })

    return { gyms }
  }
}
