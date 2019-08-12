export const getTimeDifference = (d0: Date, d1 = new Date()) => {
  var diff = d1.getTime() - d0.getTime()

  return [
    diff,
    diff / 1000,
    diff / 1000 / 60,
    diff / 1000 / 60 / 60,
    diff / 1000 / 60 / 60 / 24,
    diff / 1000 / 60 / 60 / 24 / (365 / 12),
    diff / 1000 / 60 / 60 / 24 / 365
  ].map(n => parseInt(n.toString()))
}
