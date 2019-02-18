export const toVersionStr = (num: number): string => {
  const dataVersion = ('00000000' + num).slice(-9)

  return [
    (x: string) => x.slice(0, 3),
    (x: string) => x.slice(-6).slice(0, 3),
    (x: string) => x.slice(-3)
  ]
    .map(f => f(dataVersion))
    .map(a => parseInt(a, 10))
    .join('.')
}
