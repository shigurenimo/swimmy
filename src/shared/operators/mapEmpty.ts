import { map } from 'rxjs/operators'

export const mapEmpty = <T>() =>
  map((t: T) => {
    if (Array.isArray(t)) {
      return t.length === 0 ? null : t
    }
    if (typeof t === 'object') {
      return Object.keys(t).length === 0 ? null : t
    }
    return t
  })
