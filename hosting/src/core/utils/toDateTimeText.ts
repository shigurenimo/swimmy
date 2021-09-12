import { Timestamp } from 'firebase/firestore'

export const toDateTimeText = (timestamp: Timestamp): string => {
  const date = timestamp.toDate()

  const Y = date.getFullYear()

  const M = date.getMonth() + 1

  const D = date.getDate()

  return `${Y}年${M}月${D}日`
}
