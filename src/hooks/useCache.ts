import { useMemo } from 'react'

const cacheMap = new Map<string, any>()

export const useCache = (key: string) => {
  const state = cacheMap.get(key)
  const setState = (value: any) => {
    cacheMap.set(key, value)
  }
  return [state, setState]
}
