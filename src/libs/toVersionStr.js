type CreateVersion = (num: number) => string

export const toVersionStr: CreateVersion = num => {
  const dataVersion = ('00000000' + num).slice(-9)
  return [x => x.slice(0, 3), x => x.slice(-6).slice(0, 3), x => x.slice(-3)]
    .map(f => f(dataVersion))
    .map(a => parseInt(a, 10))
    .join('.')
}
