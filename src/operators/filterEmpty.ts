import { filter } from 'rxjs/operators'

export const filterEmpty = <T>() => {
  return filter((t: T) => {
    if (Array.isArray(t) && t.length === 0) {
      return false
    }

    if (typeof t === 'object' && Object.keys(t).length === 0) {
      return false
    }

    if (typeof t === 'undefined') {
      return false
    }

    if (t === null) {
      return false
    }

    return true
  })
}
