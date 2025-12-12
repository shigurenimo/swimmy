import { UserEntity } from "core/entities"
import {
  Biography,
  Email,
  Id,
  Username,
} from "core/valueObjects"

export class UserFactory {
  static create(props: {
    id: Id
    email: Email
    username: Username
  }) {
    return new UserEntity({
      id: props.id,
      email: props.email,
      username: props.username,
      name: null,
      biography: new Biography(""),
      headerImageId: null,
      iconImageId: null,
    })
  }
}
