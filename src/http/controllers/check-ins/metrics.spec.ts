import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createAndAuthenticateUser } from '@/utils/tests/create-and-authenticate-user'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('check-in | metrics (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get check-ins count', async () => {
    const { accessToken } = await createAndAuthenticateUser(app)

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

    await prisma.checkIn.createMany({
      data: [
        {
          gymId: gym.id,
          userId: user.id,
        },
        {
          gymId: gym.id,
          userId: user.id,
        },
      ],
    })

    const response = await request(app.server)
      .get(`/check-ins/metrics`)
      .set({
        Authorization: `Bearer ${accessToken}`,
      })
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body.checkInsCount).toEqual(2)
  })
})
