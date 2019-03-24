export const toDateStringFromPrismicDate = (date: string): string => {
  const [year, month, day] = date.split('-')

  return `${year}年${month}月${day}日`
}
