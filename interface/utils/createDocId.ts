export const createDocId = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

  let docId = ""

  for (let i = 0; i < 20; i++) {
    docId += chars.charAt(Math.floor(Math.random() * chars.length))
  }

  return docId
}
