import { CustomField } from '../../microcms/types/CustomField'

export type Changelog = {
  version: '5.0.0'
  date: '2020-04-20T17:00:00.000Z'
  commits: Commit[]
}

type Commit = CustomField<{
  text: string
}>
