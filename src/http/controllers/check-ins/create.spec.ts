import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createAndAuthenticateUser } from '@/utils/tests/create-and-authenticate-user'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('check-in | create (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a check in', async () => {
    const { accessToken } = await createAndAuthenticateUser(app)

    const gym = await prisma.gym.create({
      data: {
        title: 'JS Gym',
        description: 'A gym for JS developers',
        phone: '+5511988776655',
        latitude: -30.0618911,
        longitude: -51.1480857,
      },
    })

    const response = await request(app.server)
      .post(`/gyms/${gym.id}/check-ins`)
      .set({
        Authorization: `Bearer ${accessToken}`,
      })
      .send({ latitude: -30.0618911, longitude: -51.1480857 })

    expect(response.statusCode).toBe(201)
  })
})
