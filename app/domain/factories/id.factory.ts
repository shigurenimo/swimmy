import { customAlphabet, nanoid } from "nanoid"
import { Id } from "app/domain/valueObjects"

export class IdFactory {
  static create() {
    return new Id(nanoid())
  }

  static createUsername() {
    const customNanoid = customAlphabet(
      "01234567890abcdefghijklmnopqrstuvwxyz",
      8
    )

    return new Id(customNanoid())
  }
}
