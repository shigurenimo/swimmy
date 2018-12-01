import { firestore } from 'firebase/app'
import { Document } from '../system/document'
import { Node } from '../system/node'

export interface Changelog extends Node, Document {
  contents: string[]
  date: firestore.Timestamp
  changelogType: string
  version: number
}
