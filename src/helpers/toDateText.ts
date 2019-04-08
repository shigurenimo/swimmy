import { firestore } from 'firebase/app'

export const toDateText = (
  { seconds }: firestore.Timestamp,
  hasTime: boolean = true
): string => {
  const date = new Date(seconds * 1000)
  const Y = date.getFullYear()
  const M = date.getMonth() + 1
  const D = date.getDate()
  const h = date.getHours()
  const m = date.getMinutes()

  return hasTime ? `${Y}年${M}月${D}日 ${h}時${m}分` : `${Y}年${M}月${D}日`
}
