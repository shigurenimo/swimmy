import { Post } from '../../firestore/types/post'
import { Archive } from '../types/archive'

export const toArchives = (posts: Post[]) => {
  const archives: Archive[] = []

  for (const post of posts) {
    const date = post.createdAt.toDate()

    const archive = archives.find(value => {
      return (
        value.year === date.getFullYear() && value.month === date.getMonth()
      )
    })

    if (!archive) {
      archives.push({
        year: date.getFullYear(),
        month: date.getMonth(),
        posts: [post],
      })
      continue
    }

    archive.posts.push(post)
  }

  return archives.sort((a, b) => {
    return b.year - a.year || b.month - a.month
  })
}
