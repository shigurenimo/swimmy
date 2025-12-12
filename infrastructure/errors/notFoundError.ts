export class NotFoundError extends Error {
  readonly name = "NotFoundError"

  readonly code = "NOT_FOUND"

  constructor(message = "見つかりません") {
    super(message)
  }
}
