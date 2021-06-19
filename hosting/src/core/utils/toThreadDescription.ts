import { Post } from 'src/core/types/post'
import { toDateTimeText } from 'src/core/utils/toDateTimeText'

export const toThreadDescription = (post: Post): string => {
  const dateText = toDateTimeText(post.createdAt)

  return [
    `${dateText}`,
    `「${post?.text}」`,
    '→ このスレッドの続きをよむ',
  ].join(' ')
}
