import { of, throwError } from 'rxjs'
import { mergeMap } from 'rxjs/operators'

export const mergeMapNonNullable = <T>(err = 'data not found') => {
  return mergeMap((t: T | null | void) => {
    return t === null || typeof t === 'undefined' ? throwError(err) : of(t)
  })
}
