import { InMemoryUsersRepository } from '@/repositories/in-memory/users.repository'
import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'

import { GetUserProfileUseCase } from './get-user-profile.use-case'

import { ResourceNotFoundError } from './errors/resource-not-found.error'

let usersRepository: InMemoryUsersRepository
// sut = system under test
let sut: GetUserProfileUseCase

describe('get user profile use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()

    sut = new GetUserProfileUseCase(usersRepository)
  })

  it('should be able to get user profile', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456',
    }

    const createdUser = await usersRepository.create({
      ...userData,
      password: await hash(userData.password, 6),
    })

    const { user } = await sut.execute({ userId: createdUser.id })

    expect(user.id).toEqual(expect.any(String))
    expect(user.name).toEqual(userData.name)
    expect(user.email).toEqual(userData.email)
  })

  it('should not be able to get user profile with wrond Id', async () => {
    await expect(() =>
      sut.execute({
        userId: 'not-existing-user-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
