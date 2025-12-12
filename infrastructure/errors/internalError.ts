/**
 * https://cloud.google.com/apis/design/errors?hl=ja
 * https://github.com/googleapis/googleapis/blob/master/google/rpc/code.proto
 */
export class InternalError extends Error {
  readonly name = "InternalError"

  readonly code = "INTERNAL"

  constructor(message = "内部サーバーエラー") {
    super(message)
  }
}
