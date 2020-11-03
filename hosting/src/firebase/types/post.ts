import firebase from 'firebase/app'

export type Post = {
  createdAt: firebase.firestore.Timestamp
  fileIds: string[]
  id: string
  likeCount: number
  photoURLs: string[]
  replyPostCount: number
  replyPostId: string | null
  text: string
  updatedAt: firebase.firestore.Timestamp
}
