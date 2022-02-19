import { useTimeDifference } from "app/core/hooks/useTimeDifference"

export const useDateText = (date: Date) => {
  const diff = useTimeDifference(date)

  const Y = date.getFullYear()

  const M = date.getMonth() + 1

  const D = date.getDate()

  if (diff.seconds < 60) {
    return "いま"
  }

  if (diff.hours < 1) {
    return `${diff.minutes}分前`
  }

  if (diff.days < 1) {
    return `${diff.hours}時間前`
  }

  if (diff.monthes < 1) {
    return `${diff.days}日前（${M}月${D}日）`
  }

  if (diff.years < 1) {
    return `${diff.monthes}ヶ月前（${Y}年${M}月${D}日）`
  }

  const mText = M.toString().padStart(2, "0")

  const dText = D.toString().padStart(2, "0")

  return `${Y}年${mText}月${dText}日`
}
