import { Post } from '../../types/post'

export const isPhoto = (post: Post): boolean => {
  if (post.replyPostId) {
    return false
  }

  return post.fileIds.length > 0
}
