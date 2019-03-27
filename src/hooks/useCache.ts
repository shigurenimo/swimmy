import { Post } from '../types/models/post'

type Value = {
  limit: number
  posts: Post[]
}

const cacheMap = new Map<string, Value>()

export const useCache = (key: string): [Value, (value: Value) => void] => {
  const state = cacheMap.get(key) || { limit: 16, posts: [] }
  const setState = (value: Value) => {
    cacheMap.set(key, value)
  }
  return [state, setState]
}
