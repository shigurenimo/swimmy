export class AlreadyExistsError extends Error {
  readonly name = "AlreadyExistsError"

  readonly code = "ALREADY_EXISTS"

  constructor(message = "既に存在します") {
    super(message)
  }
}
