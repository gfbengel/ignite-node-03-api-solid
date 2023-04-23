import { CheckInsRepository } from '@/repositories/check-ins.repository'
import { CheckIn } from '@prisma/client'
import dayjs from 'dayjs'
import { CheckInAlreadyValidatedError } from './errors/check-in-already-validated.error'
import { LateCheckInValidationError } from './errors/late-check-in-validation.error'
import { ResourceNotFoundError } from './errors/resource-not-found.error'

interface ValidateCheckInUseCaseRequest {
  checkInId: string
}

interface ValidateCheckInUseCaseResponse {
  checkIn: CheckIn
}

export class ValidateCheckInUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    checkInId,
  }: ValidateCheckInUseCaseRequest): Promise<ValidateCheckInUseCaseResponse> {
    const checkIn = await this.checkInsRepository.findById(checkInId)

    if (!checkIn) {
      throw new ResourceNotFoundError()
    }

    if (checkIn.validatedAt) {
      throw new CheckInAlreadyValidatedError()
    }

    const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
      checkIn.createdAt,
      'minutes',
    )

    const MAX_TIME_TO_CHECK_IN_VALIDATION_IN_MINUTES = 20

    if (
      distanceInMinutesFromCheckInCreation >
      MAX_TIME_TO_CHECK_IN_VALIDATION_IN_MINUTES
    ) {
      throw new LateCheckInValidationError()
    }

    checkIn.validatedAt = new Date()

    const updatedCheckIn = await this.checkInsRepository.save(checkIn)

    return { checkIn: updatedCheckIn }
  }
}
