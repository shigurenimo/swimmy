export const detectNight = () => {
  const hours = new Date().getHours()

  return 21 < hours || hours < 6
}
