import { useEffect, useState } from 'react'
import { interval } from 'rxjs'
import { detectNight } from 'src/core/utils/detectNight'

export const useNight = () => {
  const [state, setState] = useState(detectNight)

  useEffect(() => {
    const subscription = interval(10000).subscribe(() => {
      setState(detectNight())
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return state
}
