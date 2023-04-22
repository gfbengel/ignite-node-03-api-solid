import { InMemoryUsersRepository } from '@/repositories/in-memory/users.repository'
import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { AuthenticateUseCase } from './authenticate.use-case'
import { InvalidCredentialsError } from './errors/invalid-credentials.error'

let usersRepository: InMemoryUsersRepository
// sut = system under test
let sut: AuthenticateUseCase

describe('authenticate use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()

    sut = new AuthenticateUseCase(usersRepository)
  })

  it('should be able to authenticate', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      email: 'john.doe@example.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with wrong e-mail', async () => {
    await expect(() =>
      sut.execute({
        email: 'john.doe@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    const validEmailToTest = 'john.doe@example.com'

    await usersRepository.create({
      name: 'John Doe',
      email: validEmailToTest,
      password: await hash('123456', 6),
    })

    await expect(() =>
      sut.execute({
        email: validEmailToTest,
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
