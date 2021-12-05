import { captureException } from "@sentry/node"
import db from "db"
import {
  Biography,
  Email,
  Id,
  LoginProvider,
  UserEntity,
  Username,
} from "integrations/domain"

export class UserRepository {
  async findByEmail(email: Email) {
    try {
      const user = await db.user.findUnique({
        where: { email: email.value },
      })

      if (user === null) {
        return null
      }

      return new UserEntity({
        id: new Id(user.id),
        email: user.email ? new Email(user.email) : null,
        username: new Username(user.username),
        name: null,
        biography: new Biography(""),
        headerImageId: null,
        iconImageId: null,
        loginProvider: new LoginProvider(user.loginProvider),
      })
    } catch (error) {
      captureException(error)

      if (error instanceof Error) {
        return new Error(error.message)
      }

      throw error
    }
  }

  async findByUsername(username: Username) {
    try {
      const user = await db.user.findUnique({
        where: { username: username.value },
      })

      if (user === null) {
        return null
      }

      return new UserEntity({
        id: new Id(user.id),
        email: user.email ? new Email(user.email) : null,
        username: new Username(user.username),
        name: null,
        biography: new Biography(""),
        headerImageId: null,
        iconImageId: null,
        loginProvider: new LoginProvider(user.loginProvider),
      })
    } catch (error) {
      captureException(error)

      if (error instanceof Error) {
        return new Error(error.message)
      }

      throw error
    }
  }

  async persist(entity: UserEntity) {
    try {
      return db.user.upsert({
        create: {
          id: entity.id.value,
          email: entity.email?.value,
          username: entity.username.value,
          loginProvider: entity.loginProvider.value,
        },
        update: {},
        where: { email: entity.email?.value },
      })
    } catch (error) {
      captureException(error)

      if (error instanceof Error) {
        return new Error(error.message)
      }

      throw error
    }
  }
}
