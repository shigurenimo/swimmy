import { https } from 'firebase-functions'

export const message = (code: https.FunctionsErrorCode, name: string) => {
  return `${code}:${name}`
}
