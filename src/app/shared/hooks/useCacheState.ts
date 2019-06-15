const cacheMap = new Map<string, any>()

export const useCacheState = <T>(
  key: string,
  initialState: T
): [T, (value: T) => void] => {
  const state = cacheMap.get(key) || initialState
  const setState = (value: T) => {
    cacheMap.set(key, value)
  }
  return [state, setState]
}
