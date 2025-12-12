export class CancelledError extends Error {
  readonly name = "CancelledError"

  readonly code = "CANCELLED"

  constructor(message = "キャンセルされました") {
    super(message)
  }
}
