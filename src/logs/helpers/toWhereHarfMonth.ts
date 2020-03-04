import { firestore } from 'firebase/app'

export const toWhereHalfMonth = (
  year: number,
  month: number,
  early: boolean
) => {
  const text = [year, month, early ? 1 : 15].join('-')

  const a = new Date(text)

  a.setHours(0)
  a.setMinutes(0)
  a.setSeconds(0)

  const b = new Date(a.getFullYear(), a.getMonth(), early ? 1 : 15)

  const c = new Date(
    a.getFullYear(),
    early ? a.getMonth() : a.getMonth() + 1,
    early ? 15 : 1
  )

  return [b, c].map(firestore.Timestamp.fromDate)
}
