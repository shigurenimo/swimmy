import { Dispatch, SetStateAction, useState } from 'react'

let __EARLY__ = true

export const useEarly = (): [boolean, Dispatch<SetStateAction<boolean>>] => {
  const [early, setEarly] = useState(__EARLY__)

  __EARLY__ = early

  return [early, setEarly]
}
