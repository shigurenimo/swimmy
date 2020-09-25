import { Content } from './Content'

export type ListTypeResponse<T> = {
  contents: Content<T>[]
  length: number
  totalCount: number
  offset: number
  limit: number
}
