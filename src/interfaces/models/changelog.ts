import { firestore } from 'firebase/app'
import { Doc } from './doc'

export interface Changelog extends Doc {
  contents: string[]
  date: firestore.Timestamp
  changelogType: string
  version: number
}
