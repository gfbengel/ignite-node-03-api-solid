import { app } from '@/app'
import { Role } from '@/utils/enums/roles.enum'
import { createAndAuthenticateUser } from '@/utils/tests/create-and-authenticate-user'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('gym | create (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a gym', async () => {
    const { accessToken } = await createAndAuthenticateUser(app, Role.ADMIN)

    const response = await request(app.server)
      .post('/gyms')
      .set({
        Authorization: `Bearer ${accessToken}`,
      })
      .send({
        title: 'JS Gym',
        description: 'A gym for JS developers',
        phone: '+5511988776655',
        latitude: -30.0618911,
        longitude: -51.1480857,
      })

    expect(response.statusCode).toBe(201)
  })
})
