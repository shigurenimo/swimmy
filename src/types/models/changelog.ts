import { Doc } from './doc'

export type Changelog = Doc & {
  contents: { text: string }[]
  date: string
  version: number
}
