import { Post } from './post'

export interface PostUi extends Post {
  ui: {
    createdAt: string
  }
}
