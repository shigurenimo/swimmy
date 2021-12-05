export const useTimeDifference = (d0: Date, d1 = new Date()) => {
  const diff = d1.getTime() - d0.getTime()

  return {
    miliSeconds: diff,
    seconds: parseInt((diff / 1000).toString()),
    minutes: parseInt((diff / 1000 / 60).toString()),
    hours: parseInt((diff / 1000 / 60 / 60).toString()),
    days: parseInt((diff / 1000 / 60 / 60 / 24).toString()),
    monthes: parseInt((diff / 1000 / 60 / 60 / 24 / (365 / 12)).toString()),
    years: parseInt((diff / 1000 / 60 / 60 / 24 / 365).toString()),
  }
}
