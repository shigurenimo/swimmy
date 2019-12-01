import { Dispatch, SetStateAction, useState } from 'react'

let __LIMIT__ = 32

export const useHomeLimit = (): [number, Dispatch<SetStateAction<number>>] => {
  const [limit, setLimit] = useState(__LIMIT__)

  __LIMIT__ = limit

  return [limit, setLimit]
}
