import { Doc } from './doc'

export interface Changelog extends Doc {
  contents: { text: string }[]
  date: string
  version: number
}
