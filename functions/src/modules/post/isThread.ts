import { Post } from '../../types/post'

export const isThread = (post: Post): boolean => {
  if (post.photoURLs.length !== 0) {
    return false
  }

  return post.replyPostCount > 0
}
