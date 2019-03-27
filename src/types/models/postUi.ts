import { Post } from './post'

export type PostUi = Post & {
  ui: {
    createdAt: string
  }
}
