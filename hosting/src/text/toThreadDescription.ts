import { Post } from '../firebase/types/post'
import { toDateTimeText } from './toDateTimeText'

export const toThreadDescription = (post: Post): string => {
  const dateText = toDateTimeText(post.createdAt)

  return [
    `${dateText}`,
    `「${post?.text}」`,
    '→ このスレッドの続きをよむ',
  ].join(' ')
}
