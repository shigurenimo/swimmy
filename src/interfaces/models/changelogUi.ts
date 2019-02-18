import { Changelog } from './changelog'

export interface ChangelogUi extends Changelog {
  ui: {
    version: string
    date: string
  }
}
