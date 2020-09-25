export const findMissingKey = (
  data: { [key: string]: string | number | null },
  keys: string[]
) => {
  for (const key of keys) {
    if (key in data) continue
    return key
  }
  return null
}
