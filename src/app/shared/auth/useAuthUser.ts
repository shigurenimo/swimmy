import { auth, User } from 'firebase/app'
import { useEffect, useState } from 'react'
import { authState } from 'rxfire/auth'

export const useAuthUser = () => {
  const state = useState<User | null>(null)
  const [, setUser] = state

  useEffect(() => {
    const subscription = authState(auth()).subscribe(_user => {
      setUser(_user)
    })
    return () => subscription.unsubscribe()
  }, [setUser])

  return state
}
