export const detectNight = () => {
  const hours = new Date().getHours()

  return 18 < hours || hours < 6
}
