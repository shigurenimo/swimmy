export const createFunctionURL = (reagion: string, name: string) => {
  const { projectId } = JSON.parse(process.env.FIREBASE_CONFIG as string)

  return `https://${reagion}-${projectId}.cloudfunctions.net/${name}`
}
