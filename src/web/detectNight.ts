export const detectNight = (): 'red' | 'dark' | 'light' => {
  const hours = new Date().getHours()

  if (0 < hours && hours < 2) {
    return 'red'
  }

  if (18 < hours || hours < 6) {
    return 'dark'
  }

  return 'light'
}
