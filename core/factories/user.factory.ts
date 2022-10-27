import { UserEntity } from "core/entities"
import {
  Biography,
  Email,
  Id,
  LoginProvider,
  Username,
} from "core/valueObjects"

export class UserFactory {
  static create(props: {
    id: Id
    email: Email
    username: Username
    loginProvider: LoginProvider
  }) {
    return new UserEntity({
      id: props.id,
      email: props.email,
      username: props.username,
      name: null,
      biography: new Biography(""),
      headerImageId: null,
      iconImageId: null,
      loginProvider: props.loginProvider,
    })
  }
}
