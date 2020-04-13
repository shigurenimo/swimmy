import { firestore } from 'firebase/app'

export const toDateTimeText = (timestamp: firestore.Timestamp): string => {
  const date = timestamp.toDate()

  const Y = date.getFullYear()

  const M = date.getMonth() + 1

  const D = date.getDate()

  return `${Y}年${M}月${D}日`
}
