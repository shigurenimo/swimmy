export const toFileName = (filePath: string) => {
  const names = filePath.split('/')

  return names[names.length - 1]
}
