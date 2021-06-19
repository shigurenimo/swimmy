import firebase from 'firebase/app'
import { getTimeDifference } from 'src/core/utils/getTimeDifference'

export const toDateText = (timestamp: firebase.firestore.Timestamp): string => {
  const date = timestamp.toDate()

  const Y = date.getFullYear()

  const M = date.getMonth() + 1

  const D = date.getDate()

  const [, seconds, minutes, hours, days, monthes, years] = getTimeDifference(
    timestamp.toDate()
  )

  if (seconds < 60) {
    return 'いま'
  }

  if (hours < 1) {
    return `${minutes}分前`
  }

  if (days < 1) {
    return `${hours}時間前`
  }

  if (monthes < 1) {
    return `${days}日前（${M}月${D}日）`
  }

  if (years < 1) {
    return `${monthes}ヶ月前（${Y}年${M}月${D}日）`
  }

  return `${Y}年${M}月${D}日`
}
