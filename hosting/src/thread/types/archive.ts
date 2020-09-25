import { Post } from '../../firestore/types/post'

export type Archive = {
  year: number
  month: number
  posts: Post[]
}
