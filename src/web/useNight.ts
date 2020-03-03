import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { interval } from 'rxjs'
import { detectNight } from './detectNight'

export const useNight = (): [boolean, Dispatch<SetStateAction<boolean>>] => {
  const [state, setState] = useState(() => detectNight())

  useEffect(() => {
    const subscription = interval(10000).subscribe(() => {
      setState(detectNight())
    })

    return () => subscription.unsubscribe()
  }, [])

  return [state, setState]
}
