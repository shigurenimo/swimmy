type State<T> = {
  docs: T[]
  limit: number
}

const cacheMap = new Map<string, State<any>>()

export const useCollectionState = <T>(
  key: string,
  docs: T[] = [],
  limit = 16
): [T[], number, (docs: T[], limit: number) => void] => {
  const _state: State<T> = { docs, limit }

  const state: State<T> = cacheMap.get(key) || _state

  const setState = (_docs: T[], _limit: number) => {
    cacheMap.set(key, { docs: _docs, limit: _limit })
  }

  return [state.docs, state.limit, setState]
}
