import { useMemo } from 'react'
import { Subscription } from 'rxjs'

type SetSubscription = (value: Subscription) => void

export const useSubscription = (): [Subscription, SetSubscription] => {
  const map = useMemo<Map<string, Subscription>>(() => {
    return new Map([['root', new Subscription()]])
  }, [])
  const subscription = map.get('root')!
  const setSubscription = (value: Subscription) => {
    subscription.unsubscribe()
    map.set('root', value)
  }
  return [subscription, setSubscription]
}
