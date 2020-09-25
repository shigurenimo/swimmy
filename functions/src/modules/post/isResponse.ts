import { Post } from '../../types/post'

export const isResponse = (post: Post): boolean => {
  return post.replyPostId !== null
}
