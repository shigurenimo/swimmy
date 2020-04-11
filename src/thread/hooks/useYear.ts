import { Dispatch, SetStateAction, useState } from 'react'

let __YEAR__ = 2017 + Math.floor(Math.random() * (2020 - 2017))

export const useYear = (): [number, Dispatch<SetStateAction<number>>] => {
  const [year, setYear] = useState(__YEAR__)

  __YEAR__ = year

  return [year, setYear]
}
