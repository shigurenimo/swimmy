export const toDateText = (date: Date, separator = '') => {
  const a = date.getFullYear().toString().padEnd(4, '0')

  const b = (date.getMonth() + 1).toString().padStart(2, '0')

  const c = date.getDate().toString().padStart(2, '0')

  return [a, b, c].join(separator)
}
