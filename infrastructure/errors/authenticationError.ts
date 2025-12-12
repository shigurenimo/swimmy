export class AuthenticationError extends Error {
  readonly name = "AuthenticationError"

  readonly code = "UNAUTHENTICATED"

  constructor(message = "認証エラー") {
    super(message)
  }
}
