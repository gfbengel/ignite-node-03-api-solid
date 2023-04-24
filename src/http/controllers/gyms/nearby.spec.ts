import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/tests/create-and-authenticate-user'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('gym | nearby (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to list nearby gyms', async () => {
    const { accessToken } = await createAndAuthenticateUser(app)

    const defaultCoordinate = {
      latitude: -30.0618911,
      longitude: -51.1480857,
    }

    const distantCoordinate = {
      latitude: -29.6952969,
      longitude: -51.1299876,
    }

    await request(app.server)
      .post('/gyms')
      .set({
        Authorization: `Bearer ${accessToken}`,
      })
      .send({
        title: 'JS Gym',
        description: 'A gym for JS developers',
        phone: '+5511988776655',
        ...defaultCoordinate,
      })

    await request(app.server)
      .post('/gyms')
      .set({
        Authorization: `Bearer ${accessToken}`,
      })
      .send({
        title: 'TS Gym',
        description: 'A gym for TS developers',
        phone: '+5511988776655',
        ...distantCoordinate,
      })

    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({
        ...defaultCoordinate,
      })
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'JS Gym',
      }),
    ])
  })
})
