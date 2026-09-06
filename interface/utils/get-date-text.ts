export function getDateText(date: Date, now = new Date()) {
  const milliseconds = now.getTime() - date.getTime()
  // サーバーとブラウザのタイムゾーンに依存せず、日本時間の日付を表示する。
  const japanDate = new Date(date.getTime() + 9 * 3_600_000)
  const year = japanDate.getUTCFullYear()
  const month = japanDate.getUTCMonth() + 1
  const day = japanDate.getUTCDate()

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
