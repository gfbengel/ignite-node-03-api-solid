import { InMemoryUsersRepository } from '@/repositories/in-memory/users.repository'
import { compare } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { UserAlreadyExistsError } from './errors/user-already-exists.error'
import { RegisterUseCase } from './register.use-case'

let usersRepository: InMemoryUsersRepository
// sut = system under test
let sut: RegisterUseCase

describe('register use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()

    sut = new RegisterUseCase(usersRepository)
  })

  it('should be able to register', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const passwordToTest = '123456'

    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: passwordToTest,
    })

    const isPasswordCorrectlyHashed = await compare(
      passwordToTest,
      user.password,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same e-mail twice', async () => {
    const emailToTest = 'john.doe@example.com'

    await sut.execute({
      name: 'John Doe',
      email: emailToTest,
      password: '123456',
    })

    await expect(() =>
      sut.execute({
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
