import { auth, User } from 'firebase/app'
import { useEffect, useState } from 'react'
import { authState } from 'rxfire/auth'

export const useAuthUser = () => {
  const state = useState<User | null>(null)
  const [, setAuthUser] = state

  useEffect(() => {
    const subscription = authState(auth()).subscribe(_user => {
      setAuthUser(_user)
    })
    return () => subscription.unsubscribe()
  }, [setAuthUser])

  return state
}
