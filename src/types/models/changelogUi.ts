import { Changelog } from './changelog'

export type ChangelogUi = Changelog & {
  ui: {
    version: string
    date: string
  }
}
