import { useMemo } from 'react'
import { Subscription } from 'rxjs'

export const useSubscriptionMap = (keys: string[]) => {
  return useMemo<Map<string, Subscription>>(() => {
    const map = new Map()
    keys.forEach(key => {
      map.set(key, new Subscription())
    })
    return map
  }, [])
}
