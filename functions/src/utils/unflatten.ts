export const unflatten = <T>(array: T[], limit = 500): T[][] => {
  const task: T[][] = []

  array.forEach((b, index) => {
    const n = parseInt((index / limit).toString())
    if (!task[n]) {
      task[n] = []
    }
    task[n].push(b)
  })

  return task
}
