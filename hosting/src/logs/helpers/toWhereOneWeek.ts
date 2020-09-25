import { firestore } from 'firebase/app'

export const toWhereOneWeek = (year: number, month: number, date: number) => {
  const text = [year, month, date].join('-')

  const a = new Date(text)

  a.setHours(0)
  a.setMinutes(0)
  a.setSeconds(0)

  const b = new Date(a.getFullYear(), a.getMonth(), a.getDate() - 1)

  const c = new Date(a.getFullYear(), a.getMonth(), a.getDate() + 7)

  return [b, c].map(firestore.Timestamp.fromDate)
}
