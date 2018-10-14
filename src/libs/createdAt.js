// @flow

export const createdAt = (seconds: number) => {
  const date = new Date(seconds * 1000)
  const Y = date.getFullYear()
  const M = date.getMonth() - 1
  const D = date.getDate()
  const h = date.getHours()
  const m = date.getMinutes()
  return `${Y}/${M}/${D} ${h}時${m}分`
}
