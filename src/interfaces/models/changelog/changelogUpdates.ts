import { firestore } from 'firebase/app'
import { Update } from '../system/update'

export interface ChangelogUpdates extends Update {
  text: string
  date: firestore.Timestamp
  changelogType: string
}
