import { Dispatch, SetStateAction, useState } from 'react'

let __MONTH__ = 1 + Math.floor(Math.random() * (12 - 1))

export const useMonth = (): [number, Dispatch<SetStateAction<number>>] => {
  const [month, setMonth] = useState(__MONTH__)

  __MONTH__ = month

  return [month, setMonth]
}
