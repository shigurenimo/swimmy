import { auth } from 'firebase/app'
import { useEffect, useState } from 'react'
import { authState } from 'rxfire/auth'
import { first } from 'rxjs/operators'

export const useAuthLoading = () => {
  const state = useState(auth().currentUser === null)

  const [, setIsLoggingIn] = state

  useEffect(() => {
    const subscription = authState(auth())
      .pipe(first())
      .subscribe(_user => {
        setIsLoggingIn(false)
      })
    return () => subscription.unsubscribe()
  }, [setIsLoggingIn])

  return state
}
