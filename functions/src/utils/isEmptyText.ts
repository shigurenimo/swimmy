export const isEmptyText = (text: string) => {
  return text.match(/\S/g) === null
}
