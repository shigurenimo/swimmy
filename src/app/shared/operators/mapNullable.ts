import { map } from 'rxjs/operators'

export const mapNullable = <T>() => {
  return map((t: T | void) => {
    if (typeof t === 'object') {
      return Object.keys(t).length === 0 ? null : t
    }
    return t || null
  })
}
