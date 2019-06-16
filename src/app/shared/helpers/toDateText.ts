import { firestore } from 'firebase/app'

export const toDateText = ({ seconds }: firestore.Timestamp): string => {
  const date = new Date(seconds * 1000)
  const Y = date.getFullYear()
  const M = date.getMonth() + 1
  const D = date.getDate()

  const now = new Date()

  if (0 < now.getFullYear() - date.getFullYear()) {
    return `${Y}年${M}月${D}日`
  }

  if (0 < now.getMonth() - date.getMonth()) {
    return `${Y}年${M}月${D}日`
  }

  const _date = now.getDate() - date.getDate()

  if (0 < _date) {
    return `${_date}日前`
  }

  const _hours = now.getHours() - date.getHours()

  if (0 < _hours) {
    return `${_hours}時間前`
  }

  const _minutes = now.getMinutes() - date.getMinutes()

  if (0 < _minutes) {
    return `${_minutes}分前`
  }

  return '今'
}
