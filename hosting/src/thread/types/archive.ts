import { Post } from '../../firebase/types/post'

export type Archive = {
  year: number
  month: number
  posts: Post[]
}
