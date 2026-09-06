export function getDateText(date: Date, now = new Date()) {
  const milliseconds = now.getTime() - date.getTime()
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  if (milliseconds < 60_000) {
    return "いま"
  }

  if (milliseconds < 3_600_000) {
    return `${Math.trunc(milliseconds / 60_000)}分前`
  }

  if (milliseconds < 86_400_000) {
    return `${Math.trunc(milliseconds / 3_600_000)}時間前`
  }

  const days = milliseconds / 86_400_000

  if (days < 365 / 12) {
    return `${Math.trunc(days)}日前（${month}月${day}日）`
  }

  if (days < 365) {
    return `${Math.trunc(days / (365 / 12))}ヶ月前（${year}年${month}月${day}日）`
  }

  return `${year}年${month.toString().padStart(2, "0")}月${day.toString().padStart(2, "0")}日`
}
