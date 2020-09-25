import { Post } from '../types/post'
import { systemFields } from '../utils/systemFIelds'

type Input = {
  fileIds: string[]
  text: string
  replyPostId: string
  photoURLs: string[]
  postId: string
}

export const createPost = (input: Input): Post => {
  return {
    ...systemFields(input.postId),
    fileIds: input.fileIds,
    likeCount: 0,
    photoURLs: input.photoURLs,
    replyPostCount: 0,
    replyPostId: input.replyPostId || null,
    text: input.text,
  }
}
