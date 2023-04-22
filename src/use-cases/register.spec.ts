import { InMemoryUsersRepository } from '@/repositories/in-memory/users.repository'
import { compare } from 'bcryptjs'
import { describe, expect, it } from 'vitest'
import { UserAlreadyExistsError } from './errors/user-already-exists.error'
import { RegisterUseCase } from './register.use-case'

describe('register use case', () => {
  it('should be able to register', async () => {
    const usersRepository = new InMemoryUsersRepository()

    const registerUseCase = new RegisterUseCase(usersRepository)

    const { user } = await registerUseCase.execute({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const usersRepository = new InMemoryUsersRepository()

    const registerUseCase = new RegisterUseCase(usersRepository)

    const passwordToTest = '123456'

    const { user } = await registerUseCase.execute({
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
    const usersRepository = new InMemoryUsersRepository()

    const registerUseCase = new RegisterUseCase(usersRepository)

    const emailToTest = 'john.doe@example.com'

    await registerUseCase.execute({
      name: 'John Doe',
      email: emailToTest,
      password: '123456',
    })

    expect(() =>
      registerUseCase.execute({
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
