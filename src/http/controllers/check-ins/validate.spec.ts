import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { Role } from '@/utils/enums/roles.enum'
import { createAndAuthenticateUser } from '@/utils/tests/create-and-authenticate-user'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('check-in | validate (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to validate a check in', async () => {
    const { accessToken } = await createAndAuthenticateUser(app, Role.ADMIN)

    const user = await prisma.user.findFirstOrThrow()

    const gym = await prisma.gym.create({
      data: {
        title: 'JS Gym',
        description: 'A gym for JS developers',
        phone: '+5511988776655',
        latitude: -30.0618911,
        longitude: -51.1480857,
      },
    })
    let checkIn = await prisma.checkIn.create({
      data: {
        gymId: gym.id,
        userId: user.id,
      },
    })

    const response = await request(app.server)
      .patch(`/check-ins/${checkIn.id}/validate`)
      .set({
        Authorization: `Bearer ${accessToken}`,
      })
      .send()

    expect(response.statusCode).toBe(204)

    checkIn = await prisma.checkIn.findUniqueOrThrow({
      where: {
        id: checkIn.id,
      },
    })

    expect(checkIn.validatedAt).toEqual(expect.any(Date))
  })
})
