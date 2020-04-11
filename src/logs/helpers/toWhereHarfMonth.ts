import { firestore } from 'firebase/app'

export const toWhereHalfMonth = (year: number, month: number) => {
  const text = [year, month].join('-')

  const a = new Date(text)

  a.setHours(0)
  a.setMinutes(0)
  a.setSeconds(0)

  const b = new Date(a.getFullYear(), a.getMonth())

  const c = new Date(a.getFullYear(), a.getMonth() + 1, 1)

  return [b, c].map(firestore.Timestamp.fromDate)
}
